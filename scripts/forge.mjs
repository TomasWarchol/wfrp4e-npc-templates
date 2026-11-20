/**
 * Kuźnia przeciwnika: panel MG otwierany z HUD-a tokena. Nakłada szablony modułu na zaznaczone tokeny
 * i pokazuje szablony, które aktor już ma.
 */
import { MODULE_ID, PACK_ID, t } from "./constants.mjs";
import { displayName, displaySpecification, stackingMode, templateLayer, templateLayers } from "./apply.mjs";
import { readStack } from "./stacking.mjs";
import { CATEGORIES, describeTemplate, filterTemplates, projectCharacteristics, projectSkills, romanTier, stripTier, summarizeStack, uniqueTargets } from "./forge-model.mjs";

const { ApplicationV2 } = foundry.applications.api;
const escape = (text) => foundry.utils.escapeHTML(String(text ?? ""));

/** Szablony modułu nałożone na aktora. */
export function managedTemplates(actor) {
  return (actor?.itemTypes?.template ?? []).filter((item) => item.flags?.[MODULE_ID]?.managed === true);
}

/** Tier szablonu z flagi; starsze kopie bez flagi rozpoznajemy po dopisku w nazwie. */
export function templateTier(item) {
  const tier = item.flags?.[MODULE_ID]?.tier;
  if (tier) return tier;
  const roman = item.name.match(/\(Tier ([IVX]+)\)$/)?.[1];
  return roman ? ["I", "II", "III", "IV", "V"].indexOf(roman) + 1 : 0;
}

/** Wpisy panelu z indeksu kompendium (nazwy i foldery już po tłumaczeniu Babele). */
async function loadEntries() {
  const pack = game.packs.get(PACK_ID);
  if (!pack) return [];
  const index = await pack.getIndex({ fields: [`flags.${MODULE_ID}.tier`, `flags.${MODULE_ID}.category`, "folder", "img"] });
  return index.map((entry) => ({
    id: entry._id,
    name: entry.name,
    img: entry.img,
    tier: entry.flags?.[MODULE_ID]?.tier ?? 0,
    category: entry.flags?.[MODULE_ID]?.category ?? "",
    group: pack.folders.get(entry.folder)?.name ?? "",
    sort: pack.folders.get(entry.folder)?.sort ?? 0
  }));
}

export class TemplateForge extends ApplicationV2 {
  static DEFAULT_OPTIONS = {
    id: "wfrp4e-npc-templates-forge",
    classes: ["wfrp4e-npc-templates-forge"],
    window: { title: "WFRP4E_TEMPLATES.Forge.Title", icon: "fa-solid fa-hammer", resizable: true },
    position: { width: 820, height: 660 },
    actions: {
      apply: TemplateForge.#onApply,
      select: TemplateForge.#onSelect,
      remove: TemplateForge.#onRemove,
      category: TemplateForge.#onCategory,
      tier: TemplateForge.#onTier
    }
  };

  /** Jedno okno na klienta; kolejne kliknięcie w HUD-zie tylko zmienia token odniesienia. */
  static open(token) {
    const forge = foundry.applications.instances.get(this.DEFAULT_OPTIONS.id) ?? new this();
    forge.anchor = token;
    forge.render({ force: true });
    return forge;
  }

  anchor = null;
  search = "";
  category = "all";
  tiers = new Set();
  selected = null;
  /** Aktor, którego wartości pokazuje panel (uuid); domyślnie pierwszy cel. */
  focus = null;
  #entries = null;
  #preview = null;

  /** Zaznaczone tokeny; gdy token z HUD-a nie jest zaznaczony, celem jest tylko on. */
  get tokens() {
    const controlled = canvas.tokens?.controlled ?? [];
    if (this.anchor && !controlled.includes(this.anchor)) return [this.anchor];
    return controlled.length ? controlled : (this.anchor ? [this.anchor] : []);
  }

  async _prepareContext() {
    this.#entries ??= await loadEntries();
    if (this.selected && this.#preview?.id !== this.selected) this.#preview = await game.packs.get(PACK_ID)?.getDocument(this.selected) ?? null;
    if (!this.selected) this.#preview = null;
    return {};
  }

  async _renderHTML() {
    const tokens = this.tokens.filter((token) => token.actor);
    const { actors, shared } = uniqueTargets(tokens);
    const root = document.createElement("div");
    root.className = "forge";
    const focused = actors.find((actor) => actor.uuid === this.focus) ?? actors[0];
    root.innerHTML = `<div class="forge-browse">${this.#targetsHTML(tokens, actors, shared)}${this.#stackHTML(actors[0], actors.length - 1)}${this.#filtersHTML()}${this.#listHTML()}</div>
      <div class="forge-side">${this.#currentHTML(focused, actors)}${this.#previewHTML(actors.length)}</div>`;
    return root;
  }

  _replaceHTML(result, content) {
    const scroll = content.querySelector(".forge-list")?.scrollTop ?? 0;
    const focused = document.activeElement?.name === "forge-search";
    content.replaceChildren(result);
    content.querySelector(".forge-list").scrollTop = scroll;
    const input = content.querySelector("input[name=forge-search]");
    input.addEventListener("input", foundry.utils.debounce(() => {
      this.search = input.value;
      this.render();
    }, 150));
    if (focused) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
    content.querySelector("select[name=forge-focus]")?.addEventListener("change", (event) => {
      this.focus = event.target.value;
      this.render();
    });
  }

  /**
   * Obecne wartości wybranego celu: cechy (z częścią z szablonów), Żywotność, rozwinięte umiejętności,
   * talenty i cechy stworzeń. Gdy wybrano szablon, cechy i umiejętności pokazują też wartość po nałożeniu.
   */
  #currentHTML(actor, actors) {
    if (!actor) return "";
    const mode = stackingMode();
    const preview = this.#preview;
    const picker = actors.length > 1
      ? `<select name="forge-focus">${actors.map((other) => `<option value="${other.uuid}" ${other === actor ? "selected" : ""}>${escape(other.name)}</option>`).join("")}</select>`
      : `<span>${escape(actor.name)}</span>`;
    const abbrev = game.wfrp4e.config.characteristicsAbbrev ?? {};
    const values = Object.fromEntries(Object.entries(actor.system.characteristics ?? {}).map(([key, data]) => [key, data.value]));
    const appliedTemplates = managedTemplates(actor);
    const applied = appliedTemplates.map((item) => item.system.characteristics);
    const previewLayer = preview ? templateLayer(preview) : "preview";
    const stats = projectCharacteristics(values, applied, preview?.system.characteristics ?? null, mode,
      { layers: appliedTemplates.map(templateLayer), previewLayer }).map(({ key, value, fromTemplates, projected }) => {
      const part = fromTemplates ? `<small>${fromTemplates > 0 ? "+" : ""}${fromTemplates}</small>` : "";
      const next = projected === null ? "" : `<em class="${projected > value ? "up" : "down"}">→ ${projected}</em>`;
      return `<span class="forge-stat"><b>${escape(game.i18n.localize(abbrev[key] ?? key))}</b> ${value}${part}${next}</span>`;
    }).join("");
    const wounds = actor.system.status?.wounds;
    const added = (preview?.system.skills.list ?? []).filter((entry) => !entry.group).map(({ name, advances }) => ({ name: displayName(name), advances }));
    const owned = actor.itemTypes.skill.map((skill) => ({
      name: skill.name,
      advances: skill.system.advances.value,
      stack: readStack({ kind: "skill", value: skill.system.advances.value, flags: skill.flags?.[MODULE_ID] ?? {} })
    }));
    const skills = projectSkills(owned, added, mode, { layers: templateLayers(actor), layer: previewLayer })
      .map(({ name, advances, projected }) => `<li>${escape(name)} <span>${advances ?? "–"}${projected === null ? "" : ` <em class="up">→ ${projected}</em>`}</span></li>`).join("");
    const counts = new Map();
    for (const talent of actor.itemTypes.talent) counts.set(talent.name, (counts.get(talent.name) ?? 0) + 1);
    const talents = [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([name, count]) => escape(count > 1 ? `${name} ×${count}` : name)).join(", ");
    const traits = actor.itemTypes.trait.map((trait) => escape(trait.system.specification?.value ? `${trait.name} ${trait.system.specification.value}` : trait.name)).join(", ");
    const modeNote = t({ max: "Forge.Current.ModeMax", sum: "Forge.Current.ModeSum" }[mode] ?? "Forge.Current.ModeLayers");
    return `<section class="forge-current">
      <header><h4>${t("Forge.Current.Title")}</h4>${picker}</header>
      <div class="forge-stat-grid">${stats}</div>
      <p class="forge-current-line">${wounds ? `<b>${t("Forge.Current.Wounds")}</b> ${wounds.value}/${wounds.max} · ` : ""}<small>${modeNote}</small></p>
      ${skills ? `<h5>${t("Forge.Current.Skills")}</h5><ul class="forge-skill-list">${skills}</ul>` : ""}
      ${talents ? `<h5>${t("Forge.Current.Talents")}</h5><p class="forge-current-line">${talents}</p>` : ""}
      ${traits ? `<h5>${t("Forge.Current.Traits")}</h5><p class="forge-current-line">${traits}</p>` : ""}
    </section>`;
  }

  #targetsHTML(tokens, actors, shared) {
    if (!actors.length) return `<p class="forge-targets forge-warning">${t("Forge.NoTargets")}</p>`;
    const names = [...new Set(tokens.map((token) => token.name))].map(escape).join(", ");
    const warning = shared ? `<p class="forge-warning"><i class="fa-solid fa-link"></i> ${t("Forge.Shared", { count: shared })}</p>` : "";
    return `<p class="forge-targets"><i class="fa-solid fa-crosshairs"></i> ${t("Forge.Targets", { count: actors.length, names })}</p>${warning}`;
  }

  #stackHTML(actor, others = 0) {
    if (!actor) return "";
    const templates = managedTemplates(actor);
    const label = `<h4>${t("Forge.Stack", { name: escape(actor.name) })}${others ? ` <small>${t("Forge.StackOthers", { count: others })}</small>` : ""}</h4>`;
    if (!templates.length) return `<section class="forge-stack">${label}<p class="forge-empty">${t("Forge.StackEmpty")}</p></section>`;
    const { list } = summarizeStack(templates.map((item) => ({ name: item.name, tier: templateTier(item), id: item.id })));
    const chips = list.map((entry) => {
      const item = templates.find((template) => stripTier(template.name) === entry.name);
      const source = this.#entries?.find((candidate) => candidate.name === item?.name);
      const name = source ? `<a data-action="select" data-entry-id="${source.id}" data-tooltip="${t("Forge.Preview.Show")}">${escape(entry.name)}</a>` : escape(entry.name);
      return `<span class="forge-chip tier-${entry.tier}">${tierPill(entry.tier)}${name}
        <a data-action="remove" data-item-id="${item?.id}" data-tooltip="${t("Forge.Remove")}"><i class="fa-solid fa-xmark"></i></a></span>`;
    }).join("");
    return `<section class="forge-stack">${label}<div class="forge-chips">${chips}</div></section>`;
  }

  #filtersHTML() {
    const tabs = ["all", ...CATEGORIES].map((id) =>
      `<button type="button" data-action="category" data-category="${id}" class="${this.category === id ? "active" : ""}">${t(`Forge.Category.${id}`)}</button>`).join("");
    const tiers = [1, 2, 3, 4, 5].map((tier) =>
      `<button type="button" data-action="tier" data-tier="${tier}" class="tier-${tier} ${this.tiers.has(tier) ? "active" : ""}">${romanTier(tier)}</button>`).join("");
    return `<div class="forge-filters">
      <input type="search" name="forge-search" value="${escape(this.search)}" placeholder="${t("Forge.Search")}" autocomplete="off">
      <nav class="forge-tabs">${tabs}</nav>
      <div class="forge-tiers"><span>${t("Forge.Tier")}</span>${tiers}</div>
    </div>`;
  }

  #listHTML() {
    const entries = filterTemplates(this.#entries ?? [], { search: this.search, category: this.category, tiers: this.tiers });
    if (!entries.length) return `<ol class="forge-list"><li class="forge-empty">${t("Forge.NoResults")}</li></ol>`;
    const groups = new Map();
    for (const entry of [...entries].sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || a.sort - b.sort)) {
      if (!groups.has(entry.group)) groups.set(entry.group, []);
      groups.get(entry.group).push(entry);
    }
    const rows = [...groups].map(([group, list]) => `<li class="forge-group">${escape(group)}</li>${list.map((entry) =>
      `<li class="forge-row ${this.selected === entry.id ? "selected" : ""}" data-action="select" data-entry-id="${entry.id}">
        <img src="${escape(entry.img)}" alt=""><span class="forge-name">${escape(stripTier(entry.name))}</span>${tierPill(entry.tier)}
        <button type="button" class="forge-quick" data-action="apply" data-entry-id="${entry.id}" data-tooltip="${t("Forge.ApplyQuick")}"><i class="fa-solid fa-plus"></i></button></li>`).join("")}`).join("");
    return `<ol class="forge-list">${rows}</ol>`;
  }

  #previewHTML(targetCount) {
    const template = this.#preview;
    if (!template) return `<aside class="forge-preview forge-preview-empty"><p>${t("Forge.Preview.Empty")}</p></aside>`;
    const data = describeTemplate(template.system, template.flags?.[MODULE_ID] ?? {}, {
      translate: displayName,
      specification: displaySpecification,
      abbrev: Object.fromEntries(Object.entries(game.wfrp4e.config.characteristicsAbbrev ?? {}).map(([key, label]) => [key, game.i18n.localize(label)])),
      spellName: (uuid) => fromUuidSync(uuid)?.name ?? uuid,
      affixMode: game.settings.get(MODULE_ID, "nameAffixes"),
      deityLabel: t("Forge.Preview.ChosenDeity")
    });
    const tier = templateTier(template);
    const list = (items) => items.map((item) => (typeof item === "string"
      ? `<li>${escape(item)}</li>`
      : `<li class="forge-choice">${t("Forge.Preview.OneOf", { options: item.oneOf.map(escape).join(" / ") })}</li>`)).join("");
    const section = (key, items) => (items.length ? `<section><h4>${t(`Forge.Preview.${key}`)}</h4><ul>${list(items)}</ul></section>` : "");
    const characteristics = data.characteristics.length
      ? `<section><h4>${t("Forge.Preview.Characteristics")}</h4><div class="forge-stats">${data.characteristics.map(({ label, value }) =>
        `<span class="${value.startsWith("-") ? "minus" : "plus"}"><b>${escape(label)}</b> ${value}</span>`).join("")}</div></section>` : "";
    const magic = [...(data.chooseLore ? [t("Forge.Preview.LoreNote")] : []), ...data.lores.map(({ lore, number }) => {
      if (lore === "petty") return t("Forge.Preview.Petty", { count: number });
      if (lore === "*") return t(data.loreChoice === "any" ? "Forge.Preview.AnyLore" : "Forge.Preview.CollegeLore", { count: number });
      return t("Forge.Preview.NamedLore", { count: number, lore });
    })];
    const title = [data.pre && t("Forge.Preview.Pre", { title: escape(data.pre) }), data.post && t("Forge.Preview.Post", { title: escape(data.post) })].filter(Boolean);
    return `<aside class="forge-preview">
      <header><img src="${escape(template.img)}" alt=""><h3>${escape(stripTier(template.name))}</h3>${tierPill(tier)}</header>
      <div class="forge-preview-body">
        <div class="forge-description">${template.system.description?.value ?? ""}</div>
        ${template.system.gmdescription?.value ? `<div class="forge-hint"><i class="fa-solid fa-lightbulb"></i> ${template.system.gmdescription.value}</div>` : ""}
        ${characteristics}${section("Skills", data.skills)}${section("Talents", data.talents)}${section("Traits", data.traits)}
        ${section("Magic", magic)}${section("Spells", data.spells)}${section("Trappings", data.trappings)}${section("Name", title)}
      </div>
      <footer><button type="button" data-action="apply" data-entry-id="${template.id}" ${targetCount ? "" : "disabled"}>
        <i class="fa-solid fa-hammer"></i> ${t("Forge.Preview.Apply", { count: targetCount })}</button></footer>
    </aside>`;
  }

  static #onSelect(_event, target) {
    this.selected = target.dataset.entryId;
    this.render();
  }

  static async #onApply(_event, target) {
    const { actors } = uniqueTargets(this.tokens.filter((token) => token.actor));
    if (!actors.length) return ui.notifications.warn(t("Forge.NoTargets"));
    const template = await game.packs.get(PACK_ID).getDocument(target.dataset.entryId);
    // Po kolei, żeby okna wyboru systemu (broń, talent) nie otwierały się wszystkie naraz
    for (const actor of actors) await actor.createEmbeddedDocuments("Item", [template.toObject()]);
    ui.notifications.info(t("Forge.Applied", { template: stripTier(template.name), count: actors.length }));
  }

  /** Zdejmuje szablon ze wszystkich celów, tak jak nakładanie działa na wszystkie zaznaczone tokeny. */
  static async #onRemove(_event, target) {
    const { actors } = uniqueTargets(this.tokens.filter((token) => token.actor));
    const name = actors[0]?.items.get(target.dataset.itemId)?.name;
    if (!name) return;
    for (const actor of actors) {
      const ids = managedTemplates(actor).filter((item) => item.name === name).map((item) => item.id);
      if (ids.length) await actor.deleteEmbeddedDocuments("Item", ids);
    }
  }

  static #onCategory(_event, target) {
    this.category = target.dataset.category;
    this.render();
  }

  static #onTier(_event, target) {
    const tier = Number(target.dataset.tier);
    if (this.tiers.has(tier)) this.tiers.delete(tier);
    else this.tiers.add(tier);
    this.render();
  }
}

function tierPill(tier) {
  return tier ? `<span class="forge-tier tier-${tier}">${romanTier(tier)}</span>` : "";
}

/** Odświeża otwarty panel, np. po zmianie zaznaczenia albo szablonów aktora. */
export const refreshForge = foundry.utils.debounce(() => {
  const forge = foundry.applications.instances.get(TemplateForge.DEFAULT_OPTIONS.id);
  if (forge?.rendered) forge.render();
}, 100);

/** Przycisk Kuźni w prawej kolumnie HUD-a tokena (tylko MG). */
export function addHudButton(hud, html) {
  if (!game.user.isGM) return;
  const token = hud.object;
  const root = html instanceof HTMLElement ? html : html?.[0];
  const column = root?.querySelector(".col.right");
  if (!token?.actor || !column || column.querySelector(".wfrp4e-npc-templates-hud")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "control-icon wfrp4e-npc-templates-hud";
  button.dataset.tooltip = t("Forge.HudButton");
  button.innerHTML = `<i class="fa-solid fa-hammer"></i>`;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    TemplateForge.open(token);
  });
  column.appendChild(button);
}
