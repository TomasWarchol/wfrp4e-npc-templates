/**
 * Przygotowuje szablony modułu w chwili dodania do aktora i scala umiejętności, które aktor już ma.
 */
import { MODULE_ID, I18N, log, t } from "./constants.mjs";
import { affixesFor } from "./forge-model.mjs";
import { addRating, combineCharacteristics, missingTalents, readStack, removeRating, stackedValue, talentsToRestore } from "./stacking.mjs";
import { blessingsFor, deityInName, deityOptions, needsDeityChoice, withDeity, withoutBlessScript } from "./deity.mjs";
import { arcaneOptions, loreOptions, loreProfile, loreSpecialisation, needsLoreChoice, withLore } from "./lore.mjs";
import { buildAvailability, buildNameMap, isAvailable, resolveName } from "./names.mjs";

const ITEM_TYPES = ["skill", "talent", "trait", "weapon", "armour", "trapping", "ammunition", "container"];

/** Cechy, których wartości się sumują; pozostałe przyjmują wyższą wartość. */
const ADDITIVE_TRAITS = ["Armour"];
const CORRUPTION_STRENGTH = { minor: "CORRUPTION.Minor", moderate: "CORRUPTION.Moderate", major: "CORRUPTION.Major" };
let nameMap = { names: new Map(), bases: new Map() };
let availability = {};

/**
 * Opcje aktualizacji z szablonu. Bez skipExperienceChecks system traktuje każde podniesienie rozwinięć
 * postaci gracza jak rozwój za PD i pyta o koszt („Advancement Cost”). Zawsze nowy obiekt, bo Foundry
 * dopisuje do opcji dane operacji, a te psułyby kolejną aktualizację.
 */
export function templateUpdate() {
  return { skipExperienceChecks: true };
}

const isManaged = (item) => item?.type === "template" && item.flags?.[MODULE_ID]?.managed === true;

/** Tryb łączenia szablonów z ustawienia: "sum" albo "max". Przed rejestracją ustawień (np. przy wczytywaniu) – "sum". */
export function stackingMode() {
  try {
    return game.settings.get(MODULE_ID, "stacking") === "max" ? "max" : "sum";
  } catch {
    return "sum";
  }
}

function specialisation(text) {
  const key = `${I18N}.Specialisations.${text}`;
  return game.i18n.has(key) ? game.i18n.localize(key) : text;
}

const translate = (name) => resolveName(name, nameMap, specialisation);

/** Nazwa z danych szablonu (angielska) w aktywnym tłumaczeniu, do wyświetlania w Kuźni. */
export const displayName = (name) => translate(name);

/** Wartość cechy stworzenia do wyświetlania (liczba, siła Skażenia albo przetłumaczona specjalizacja). */
export const displaySpecification = (value) => specificationValue(value);

/** Wczytuje indeksy kompendiów. Hooki Foundry przed utworzeniem dokumentu są synchroniczne, więc mapa musi być gotowa. */
export async function loadNames() {
  const entries = [];
  for (const type of ITEM_TYPES) {
    for (const pack of game.wfrp4e.tags.getPacksWithTag(type)) {
      const index = await pack.getIndex({ fields: ["flags.babele.originalName"] });
      entries.push(...index.filter((entry) => entry.type === type));
    }
  }
  nameMap = buildNameMap(entries);
  availability = buildAvailability(entries);
  log.info(`nazwy gotowe: ${nameMap.names.size}`);
}

/** Dane szablonu z nazwami w aktywnym tłumaczeniu. */
export function localizedSystem(system, translateName, loreLabel, specification = (value) => value) {
  const named = (entry) => ({ ...entry, name: translateName(entry.name) });
  const trait = (entry) => {
    const value = entry.diff?.system?.specification?.value;
    if (value === undefined) return named(entry);
    return named({ ...entry, diff: foundry.utils.mergeObject(entry.diff, { system: { specification: { value: specification(value) } } }, { inplace: false }) });
  };
  return {
    "system.skills.list": system.skills.list.map(named),
    "system.talents.list": system.talents.list.map(named),
    "system.traits.list": (system.traits?.list ?? []).map(trait),
    "system.lores.list": system.lores.list.map((lore) => ({ ...lore, name: lore.name === "*" ? "*" : loreLabel(lore.name) })),
    "system.trappings.options": system.trappings.options.map(named)
  };
}

/** Dzieli listę na umiejętności do utworzenia i te, które aktor już ma. Pozycje z wyborem zostają dla okna systemu. */
export function splitOwnedSkills(list, ownedNames) {
  const keep = [];
  const merge = [];
  for (const skill of list) (!skill.group && ownedNames.has(skill.name) ? merge : keep).push(skill);
  return { keep, merge };
}

/** Usuwa niedostępne pozycje. Wybór, w którym została jedna opcja, staje się zwykłą pozycją, bo system pominąłby go bez pytania. */
export function keepAvailable(list, available) {
  const kept = list.filter(available);
  const skipped = list.filter((entry) => !available(entry)).map((entry) => entry.name);
  const groupSize = new Map();
  for (const { group } of kept) if (group) groupSize.set(group, (groupSize.get(group) ?? 0) + 1);
  return { kept: kept.map((entry) => (entry.group && groupSize.get(entry.group) === 1 ? { ...entry, group: null } : entry)), skipped };
}

/** Usuwa z drzewa wyboru wyposażenia gałęzie bez dostępnych opcji. */
export function pruneChoices(node, keepIds) {
  const options = [];
  for (const child of node.options ?? []) {
    if (child.type === "option") {
      if (keepIds.has(child.id)) options.push(child);
    } else {
      const pruned = pruneChoices(child, keepIds);
      if (pruned.options.length) options.push(pruned);
    }
  }
  return { ...node, options };
}

/** Wartość cechy wyliczona z wartości bazowej i ocen z nałożonych szablonów, dzięki czemu kolejność usuwania jest obojętna. */
export function traitValue(base, ratings, additive) {
  const active = ratings.filter((rating) => rating > 0);
  return String(additive ? active.reduce((sum, rating) => sum + rating, base) : Math.max(base, ...active));
}

/**
 * Dzieli cechy na nowe i te, które aktor już ma. Dla posiadanych zwraca ocenę z szablonu
 * (null, gdy cecha nie ma wartości liczbowej – wtedy liczy się tylko to, że szablon jej potrzebuje).
 */
export function splitOwnedTraits(list, owned) {
  const keep = [];
  const raise = [];
  for (const trait of list) {
    const current = owned.find((other) => other.name === trait.name);
    if (!current) {
      keep.push(trait);
      continue;
    }
    const rating = parseInt(trait.diff?.system?.specification?.value);
    const numeric = !Number.isNaN(rating) && !Number.isNaN(parseInt(current.value));
    raise.push({ name: trait.name, rating: numeric ? rating : null });
  }
  return { keep, raise };
}

function specificationValue(value) {
  if (!Number.isNaN(parseInt(value))) return value;
  if (CORRUPTION_STRENGTH[value]) return game.i18n.localize(CORRUPTION_STRENGTH[value]);
  return specialisation(value);
}

/** Czy pozycja o tej nazwie istnieje w świecie albo w aktywnym kompendium (tam szuka też system). */
function nameExists(type, name) {
  const base = name.split("(")[0].trim();
  return isAvailable(name, availability[type]) || game.items.some((item) => item.type === type && item.name.split("(")[0].trim() === base);
}

function uuidExists(uuid) {
  const [, packageName, packName, , id] = uuid.split(".");
  return !!game.packs.get(`${packageName}.${packName}`)?.index.has(id);
}

/** System przerywa cały szablon, gdy nie znajdzie talentu albo umiejętności, więc brakujące pozycje wypadają wcześniej. */
function removeUnavailable(update, source, name, optionalNames) {
  const skills = keepAvailable(update["system.skills.list"], ({ name: skill }) => nameExists("skill", skill));
  const talents = keepAvailable(update["system.talents.list"], ({ name: talent }) => nameExists("talent", talent));
  const traits = keepAvailable(update["system.traits.list"], ({ uuid }) => uuidExists(uuid));
  const gear = keepAvailable(update["system.trappings.options"], ({ documentId }) => uuidExists(documentId));
  update["system.skills.list"] = skills.kept;
  update["system.talents.list"] = talents.kept;
  update["system.traits.list"] = traits.kept;
  update["system.trappings.options"] = gear.kept;
  update["system.trappings.structure"] = pruneChoices(source.trappings.structure, new Set(gear.kept.map((option) => option.id)));
  const optional = new Set(optionalNames.map(translate));
  const skipped = [...skills.skipped, ...talents.skipped.filter((talent) => !optional.has(talent)), ...traits.skipped, ...gear.skipped];
  if (skipped.length) ui.notifications.warn(t("Notifications.Skipped", { template: name, items: skipped.join(", ") }));
}

/**
 * Etykieta tradycji do okna wyboru. Część dodatków rejestruje tradycję kluczem tłumaczenia,
 * którego nie ma w pliku językowym (np. "WFRP4E.MagicLores.dark"); wtedy bierzemy nazwę z naszego pliku.
 */
function loreLabel(key, label) {
  const localized = game.i18n.localize(label);
  if (!/^WFRP4E\.MagicLores\./.test(localized)) return localized;
  return specialisation(loreSpecialisation(key));
}

/** Liczba czarów każdej tradycji w aktywnych kompendiach i w świecie (tam szuka czarów system). */
async function spellLoreCounts() {
  const counts = new Map();
  const add = (value) => value && counts.set(value, (counts.get(value) ?? 0) + 1);
  for (const pack of game.packs) {
    if (pack.documentName !== "Item") continue;
    const index = await pack.getIndex({ fields: ["system.lore.value"] });
    for (const entry of index) if (entry.type === "spell") add(entry.system?.lore?.value);
  }
  for (const item of game.items) if (item.type === "spell") add(item.system.lore.value);
  return counts;
}

/** Okno z jednym wyborem z listy; zwraca wybraną pozycję albo null po zamknięciu. */
async function promptChoice(title, choices, texts) {
  const options = choices.map((choice, index) => `<option value="${index}">${foundry.utils.escapeHTML(choice.label)}</option>`).join("");
  const index = await foundry.applications.api.DialogV2.prompt({
    window: { title },
    content: `<p>${t(`${texts}.Hint`)}</p><div class="form-group"><label>${t(`${texts}.Label`)}</label><select name="choice">${options}</select></div>`,
    ok: { label: t(`${texts}.Confirm`), callback: (_event, button) => button.form.elements.choice.value },
    rejectClose: false
  });
  return choices[index] ?? null;
}

/** Jeden wybór tradycji; zwraca profil tradycji, null po zamknięciu okna albo false, gdy nie ma z czego wybierać. */
async function chooseLore(source) {
  const labels = Object.fromEntries(Object.entries(game.wfrp4e.config.magicLores).map(([key, label]) => [key, loreLabel(key, label)]));
  const mode = source.flags[MODULE_ID]?.loreChoice ?? "arcane";
  const choices = mode === "any" ? loreOptions(await spellLoreCounts(), labels) : arcaneOptions(labels);
  if (!choices.length) {
    ui.notifications.warn(t("LoreChoice.None", { template: source.name }));
    return false;
  }
  const choice = await promptChoice(source.name, choices, "LoreChoice");
  return choice && loreProfile(choice);
}

/** Jeden wybór bóstwa; zwraca angielską nazwę boga albo null po zamknięciu okna. */
async function chooseDeity(source) {
  const choices = deityOptions(source.system).map((god) => ({ god, label: specialisation(god) }));
  return (await promptChoice(source.name, choices, "DeityChoice"))?.god ?? null;
}

/** Pyta raz o tradycję i bóstwo, a potem tworzy szablon ponownie, już z ustalonymi wyborami. */
async function createWithChoices(parent, source, options) {
  const chosen = { done: true };
  if (needsLoreChoice(source.system)) {
    chosen.lore = await chooseLore(source);
    if (!chosen.lore) return;
  }
  if (needsDeityChoice(source.system)) {
    chosen.deity = await chooseDeity(source);
    if (!chosen.deity) return;
  }
  const { keepId, render, renderSheet } = options;
  await parent.createEmbeddedDocuments("Item", [source], { keepId, render, renderSheet, [MODULE_ID]: chosen });
}

function onPreCreateTemplate(item, _data, options) {
  if (!isManaged(item) || !item.parent) return;
  const source = item.toObject();
  const chosen = options[MODULE_ID];
  // Hook przed utworzeniem jest synchroniczny, więc okna otwierają się po wstrzymaniu tego tworzenia
  if (!chosen?.done && (needsLoreChoice(source.system) || needsDeityChoice(source.system))) {
    createWithChoices(item.parent, source, options).catch((error) => log.error(error));
    return false;
  }
  let system = source.system;
  if (chosen?.lore) system = withLore(system, chosen.lore);
  if (chosen?.deity) system = withDeity(system, chosen.deity);
  const update = localizedSystem(system, translate, (key) => game.wfrp4e.config.magicLores[key] ?? key, specificationValue);
  const affixes = affixesFor(game.settings.get(MODULE_ID, "nameAffixes"), system.alterName);
  update["system.alterName.pre"] = affixes.pre;
  update["system.alterName.post"] = affixes.post;
  const owned = new Set(item.parent.itemTypes.skill.map((skill) => skill.name));
  const { keep, merge } = splitOwnedSkills(update["system.skills.list"], owned);
  update["system.skills.list"] = keep;
  update[`flags.${MODULE_ID}.pendingSkills`] = merge.map(({ name, advances }) => ({ name, advances }));
  removeUnavailable(update, system, item.name, item.flags[MODULE_ID].optional ?? []);
  // Wymagania talentów zapamiętujemy zawsze: w trybie "max" po zdjęciu innego szablonu trzeba je odtworzyć
  const needs = {};
  for (const { name, advances, group } of update["system.talents.list"]) if (!group) needs[name] = Math.max(needs[name] ?? 0, advances);
  update[`flags.${MODULE_ID}.talentNeeds`] = needs;
  if (stackingMode() === "max") {
    const owned = new Map();
    for (const talent of item.parent.itemTypes.talent) owned.set(talent.name, (owned.get(talent.name) ?? 0) + 1);
    update["system.talents.list"] = missingTalents(update["system.talents.list"], owned);
  }
  const ownedTraits = item.parent.itemTypes.trait.map((trait) => ({ name: trait.name, value: trait.system.specification.value }));
  const { keep: newTraits, raise } = splitOwnedTraits(update["system.traits.list"], ownedTraits);
  update["system.traits.list"] = newTraits;
  update[`flags.${MODULE_ID}.pendingTraits`] = raise;
  item.updateSource(update);
}

/**
 * Dane stałych zaklęć i modlitw szablonu: zaklęcia od razu zapamiętane, oznaczone jak pozostałe
 * przedmioty z szablonu, więc system usunie je przy cofnięciu.
 */
export function grantedItemData(documents, templateId) {
  return documents.map((data) => {
    const rest = { ...data };
    delete rest._id;
    return foundry.utils.mergeObject(rest, {
      ...(rest.type === "spell" ? { "system.memorized.value": true } : {}),
      [`flags.${game.system.id}.fromTemplate`]: templateId
    }, { inplace: false });
  });
}

/** Lista wyposażenia systemu przerywa nakładanie przy zaklęciach, więc dodajemy je sami. */
async function grantSpells(item) {
  const uuids = item.getFlag(MODULE_ID, "spells") ?? [];
  if (!uuids.length) return;
  const documents = (await Promise.all(uuids.map((uuid) => fromUuid(uuid)))).filter(Boolean);
  await item.parent.createEmbeddedDocuments("Item", grantedItemData(documents.map((doc) => doc.toObject()), item.id), { fromTemplate: item.id, skipExperienceChecks: true });
}

/** Angielska nazwa specjalizacji z przetłumaczonej (odwrotność specialisation). */
function englishSpecialisation(text) {
  const table = game.i18n.translations?.[I18N]?.Specialisations ?? {};
  return Object.keys(table).find((key) => table[key] === text) ?? text;
}

/** Przed utworzeniem talentu z szablonu modułu usuwa skrypt Błogosławieństwa, który pytałby o bóstwo. */
function onPreCreateTemplateTalent(item, _data, options) {
  if (item.type !== "talent" || !item.parent || !options.fromTemplate) return;
  if (!isManaged(item.parent.items.get(options.fromTemplate))) return;
  const effects = item._source.effects ?? [];
  const kept = withoutBlessScript(effects);
  if (kept.length === effects.length) return;
  // "==" wymienia całą tablicę; zwykłe updateSource scaliłoby efekty i skrypt by został
  item.updateSource({ "==effects": kept, [`flags.${MODULE_ID}.blessFrom`]: options.fromTemplate });
}

/** To samo, co robi skrypt Błogosławieństwa, ale bez pytania: błogosławieństwa boga z nazwy talentu i bóstwo postaci. */
async function grantBlessings(talent) {
  const templateId = talent.getFlag(MODULE_ID, "blessFrom");
  const actor = talent.parent;
  // Skrypt systemu działa tylko na postaciach graczy
  if (!templateId || actor?.type !== "character") return;
  const spec = deityInName(talent.name);
  if (!spec) return;
  const god = englishSpecialisation(spec);
  const prayers = await warhammer.utility.findAllItems("prayer", "", true, ["system.type.value", "system.god.value"]);
  const uuids = new Set([
    ...blessingsFor(prayers, [spec, god, specialisation(god)]).map((prayer) => prayer.uuid),
    ...(game.wfrp4e.config.godBlessings?.[god.toLowerCase()] ?? [])
  ]);
  const owned = new Set(actor.itemTypes.prayer.map((prayer) => prayer.name));
  const documents = [];
  for (const document of await Promise.all([...uuids].map((uuid) => fromUuid(uuid)))) {
    if (!document || owned.has(document.name)) continue;
    owned.add(document.name);
    documents.push(document.toObject());
  }
  if (documents.length) await actor.createEmbeddedDocuments("Item", grantedItemData(documents, templateId), { fromTemplate: templateId, ...templateUpdate() });
  await actor.update({ "system.details.god.value": specialisation(god) }, templateUpdate());
}

function onCreateTemplateTalent(item, _options, userId) {
  if (item.type !== "talent" || userId !== game.user.id || !item.getFlag(MODULE_ID, "blessFrom")) return;
  grantBlessings(item).catch((error) => log.error(error));
}

/**
 * Żywotność po zmianie szablonów: po nałożeniu pełna (nowe maksimum), po usunięciu nie wyższa niż maksimum.
 * @param {{value: number, max: number}} wounds
 * @param {boolean} fill
 */
export function woundsAfterTemplate({ value, max }, fill) {
  return fill ? max : Math.min(value, max);
}

const woundTimers = new Map();

/**
 * System dodaje przedmioty szablonu w kilku partiach (część po oknach wyboru), a maksimum Żywotności
 * liczy się od nowa po każdej. Dlatego Żywotność ustawiamy chwilę po ostatniej zmianie.
 */
function scheduleWounds(actor, fill) {
  if (!actor) return;
  const key = actor.uuid;
  const pending = woundTimers.get(key);
  clearTimeout(pending?.timer);
  const fillNow = fill || pending?.fill === true;
  const timer = setTimeout(() => {
    woundTimers.delete(key);
    const wounds = actor.system.status?.wounds;
    if (!wounds || !Number.isFinite(wounds.max)) return;
    const value = woundsAfterTemplate(wounds, fillNow);
    if (value !== wounds.value) actor.update({ "system.status.wounds.value": value }, templateUpdate()).catch((error) => log.error(error));
  }, 500);
  woundTimers.set(key, { timer, fill: fillNow });
}

/** Przedmiot dodany albo usunięty przez szablon modułu odświeża Żywotność aktora. */
function onTemplateItem(item, options, userId, fill) {
  if (userId !== game.user.id || !item.parent) return;
  const templateId = options.fromTemplate ?? item.getFlag?.(game.system.id, "fromTemplate");
  if (!templateId) return;
  const template = item.parent.items.get(templateId);
  if (template ? isManaged(template) : !fill) scheduleWounds(item.parent, fill);
}

/** Szablon modułu, który utworzył przedmiot (inny niż podany), albo null. */
function ownerTemplate(item, exceptId) {
  const owner = item.getFlag(game.system.id, "fromTemplate");
  return owner && owner !== exceptId && isManaged(item.parent?.items.get(owner)) ? owner : null;
}

/**
 * Zmiana przedmiotu po dodaniu wkładu szablonu: nowa wartość, zapis stanu łączenia,
 * a przy przejęciu – zdjęcie znacznika szablonu, który go utworzył (system usunąłby go razem z tamtym szablonem).
 */
export function stackUpdate(item, { kind, value, templateId, rating, owner, mode, additive = false, systemId = "wfrp4e" }) {
  const flags = item.flags?.[MODULE_ID] ?? {};
  const current = readStack({ kind, value, flags });
  const stack = addRating(current, { templateId, rating: rating ?? 1, value, ownerTemplate: current ? null : owner });
  const update = { _id: item.id, flags: { [MODULE_ID]: { stack } } };
  if (current?.legacy) update.flags[MODULE_ID]["-=merged"] = null;
  if (!current && owner) update.flags[systemId] = { fromTemplate: null };
  if (kind === "skill") update.system = { advances: { value: stackedValue(stack.base, stack.ratings, { mode, kind }) } };
  else if (rating !== null) update.system = { specification: { value: String(stackedValue(stack.base, stack.ratings, { mode, kind, additive })) } };
  return update;
}

/** Podnosi umiejętności i cechy stworzeń, które aktor już ma, według trybu łączenia. */
function onCreateTemplate(item, _options, userId) {
  if (!isManaged(item) || !item.parent || userId !== game.user.id) return;
  scheduleWounds(item.parent, true);
  grantSpells(item).catch((error) => log.error(error));
  const mode = stackingMode();
  const systemId = game.system.id;
  const updates = [];
  for (const { name, advances } of item.getFlag(MODULE_ID, "pendingSkills") ?? []) {
    const skill = item.parent.itemTypes.skill.find((other) => other.name === name);
    if (!skill) continue;
    updates.push(stackUpdate(skill, { kind: "skill", value: skill.system.advances.value, templateId: item.id, rating: advances, owner: ownerTemplate(skill, item.id), mode, systemId }));
  }
  const additive = new Set(ADDITIVE_TRAITS.map(translate));
  for (const { name, rating } of item.getFlag(MODULE_ID, "pendingTraits") ?? []) {
    const trait = item.parent.itemTypes.trait.find((other) => other.name === name);
    if (!trait) continue;
    const value = parseInt(trait.system.specification.value);
    updates.push(stackUpdate(trait, {
      kind: "trait", value: Number.isNaN(value) ? 1 : value, templateId: item.id, rating, owner: ownerTemplate(trait, item.id), mode, additive: additive.has(name), systemId
    }));
  }
  if (updates.length) item.parent.updateEmbeddedDocuments("Item", updates, templateUpdate()).catch((error) => log.error(error));
}

/**
 * Imię bez dopisków szablonu. System zdejmuje je tylko z samego początku i końca imienia,
 * więc przy kilku szablonach dopisek ze środka zostawał. Tu znika ostatnie wystąpienie dopisku
 * i pierwsze wystąpienie przedrostka, gdziekolwiek stoją.
 */
export function stripAffixes(name, pre, post) {
  let result = ` ${name} `;
  if (post) {
    const at = result.lastIndexOf(` ${post} `);
    if (at >= 0) result = result.slice(0, at) + result.slice(at + post.length + 1);
  }
  if (pre) {
    const at = result.indexOf(` ${pre} `);
    if (at >= 0) result = result.slice(0, at) + result.slice(at + pre.length + 1);
  }
  return result.trim();
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Czeka, aż system usunie przedmioty dodane przez szablon (robi to sam, równolegle z naszym hookiem).
 * Każda zmiana aktora uruchamia w systemie niezależne sprawdzenie Przeciążenia; kilka naraz próbuje usunąć
 * ten sam efekt i kończy się błędem „ActiveEffect … does not exist”. Dlatego nasze zmiany idą dopiero po nim.
 */
async function templateItemsGone(actor, templateId, timeout = 5000) {
  const start = Date.now();
  const pending = () => actor.items.some((other) => other.getFlag(game.system.id, "fromTemplate") === templateId);
  while (pending() && Date.now() - start < timeout) await sleep(100);
  await sleep(300);
}

/**
 * Zmiany aktora cofające szablon: imię bez dopisków oraz wartości umiejętności i cech stworzeń przeliczone
 * bez wkładu tego szablonu. Zwraca też przejęte przedmioty, których nie potrzebuje już żaden szablon.
 */
export function revertUpdate(actor, template, { translateName = translate, mode = stackingMode() } = {}) {
  const update = {};
  const { pre, post } = template.system.alterName;
  const name = stripAffixes(actor.name, pre, post);
  if (name !== actor.name) update.name = name;
  const items = [];
  const deletes = [];
  const additive = new Set(ADDITIVE_TRAITS.map(translateName));
  const revert = (item, kind, value, numeric) => {
    const stack = readStack({ kind, value, flags: item.flags?.[MODULE_ID] ?? {} });
    if (!stack?.ratings?.[template.id]) return;
    const { stack: next, remove } = removeRating(stack, template.id);
    if (remove) {
      deletes.push(item.id);
      return;
    }
    // Foundry scala obiekty przy aktualizacji, więc wkład zdjętego szablonu trzeba usunąć jawnie ("-=")
    const stored = item.flags?.[MODULE_ID]?.stack ? { ...next, ratings: { [`-=${template.id}`]: null } } : next;
    const entry = { _id: item.id, flags: { [MODULE_ID]: { stack: stored } } };
    if (stack.legacy) entry.flags[MODULE_ID]["-=merged"] = null;
    const result = stackedValue(next.base, next.ratings, { mode, kind, additive: additive.has(item.name) });
    if (kind === "skill") entry.system = { advances: { value: result } };
    else if (numeric) entry.system = { specification: { value: String(result) } };
    items.push(entry);
  };
  for (const skill of actor.itemTypes.skill) revert(skill, "skill", skill.system.advances.value, true);
  for (const trait of actor.itemTypes.trait) {
    const value = parseInt(trait.system.specification.value);
    revert(trait, "trait", Number.isNaN(value) ? 1 : value, !Number.isNaN(value));
  }
  if (items.length) update.items = items;
  return { update, deletes };
}

/** W trybie "max" pozostałe szablony dostają z powrotem talenty, które zdjęty szablon dzielił z nimi. */
async function restoreTalents(actor) {
  const owned = new Map();
  for (const talent of actor.itemTypes.talent) owned.set(talent.name, (owned.get(talent.name) ?? 0) + 1);
  const templates = actor.itemTypes.template.filter(isManaged).map((template) => ({ id: template.id, needs: template.getFlag(MODULE_ID, "talentNeeds") }));
  for (const { templateId, name, count } of talentsToRestore(templates, owned)) {
    let talent = null;
    try {
      talent = await game.wfrp4e.utility.findTalent(name);
    } catch {
      continue;
    }
    const data = Array.from({ length: count }, () => talent.toObject());
    await actor.createEmbeddedDocuments("Item", data, { fromTemplate: templateId, ...templateUpdate() });
  }
}

async function revertTemplate(template) {
  const actor = template.parent;
  await templateItemsGone(actor, template.id);
  const { update, deletes } = revertUpdate(actor, template);
  // Jedna aktualizacja zamiast kilku: system przelicza aktora tylko raz
  if (Object.keys(update).length) await actor.update(update, templateUpdate());
  if (deletes.length) await actor.deleteEmbeddedDocuments("Item", deletes, templateUpdate());
  if (stackingMode() === "max") await restoreTalents(actor);
  scheduleWounds(actor, false);
}

/** Po usunięciu szablonu cofa dopiski w imieniu i rozwinięcia dodane do istniejących umiejętności. */
function onDeleteTemplate(item, _options, userId) {
  if (!isManaged(item) || !item.parent || userId !== game.user.id) return;
  revertTemplate(item).catch((error) => log.error(error));
}

/**
 * System dodaje modyfikatory cech wszystkich szablonów (computeTemplates). W trybie "max" szablony modułu
 * liczą się jak w combineCharacteristics; pozostałe szablony dalej się sumują.
 */
export function installCharacteristicStacking() {
  let proto = null;
  for (const model of Object.values(CONFIG.Actor.dataModels ?? {})) {
    for (let current = model?.prototype; current && !proto; current = Object.getPrototypeOf(current)) {
      if (Object.hasOwn(current, "computeTemplates")) proto = current;
    }
    if (proto) break;
  }
  if (!proto) {
    log.warn("nie znaleziono computeTemplates – tryb najwyższej wartości nie obejmie cech");
    return;
  }
  const original = proto.computeTemplates;
  proto.computeTemplates = function computeTemplates(...args) {
    if (stackingMode() !== "max") return original.apply(this, args);
    const templates = this.parent.itemTypes.template;
    for (const template of templates.filter((other) => !isManaged(other))) {
      for (const key in this.characteristics) this.characteristics[key].modifier += template.system.characteristics[key] ?? 0;
    }
    const combined = combineCharacteristics(templates.filter(isManaged).map((template) => template.system.characteristics), "max");
    for (const key in this.characteristics) this.characteristics[key].modifier += combined[key] ?? 0;
  };
}

export function installApplyHooks() {
  Hooks.on("preCreateItem", onPreCreateTemplate);
  Hooks.on("preCreateItem", onPreCreateTemplateTalent);
  Hooks.on("createItem", onCreateTemplateTalent);
  Hooks.on("createItem", onCreateTemplate);
  Hooks.on("deleteItem", onDeleteTemplate);
  Hooks.on("createItem", (item, options, userId) => onTemplateItem(item, options, userId, true));
}

/** Sprawdza, czy każda nazwa i każdy przedmiot z zestawu istnieją w tym świecie; zwraca listę braków. */
export async function checkTemplates(pack) {
  const missing = [];
  const find = async (lookup, template, name) => {
    try {
      await lookup(translate(name));
    } catch {
      if (!template.flags[MODULE_ID]?.optional?.includes(name)) missing.push(`${template.name}: ${name}`);
    }
  };
  for (const template of await pack.getDocuments()) {
    const { skills, talents, trappings, traits } = template.system;
    for (const skill of skills.list) await find(game.wfrp4e.utility.findSkill.bind(game.wfrp4e.utility), template, skill.name);
    for (const talent of talents.list) await find(game.wfrp4e.utility.findTalent.bind(game.wfrp4e.utility), template, talent.name);
    for (const trait of traits.list) {
      if (!await fromUuid(trait.uuid)) missing.push(`${template.name}: ${trait.name}`);
    }
    for (const option of trappings.options) {
      if (!await fromUuid(option.documentId)) missing.push(`${template.name}: ${option.name}`);
    }
  }
  return missing;
}
