/**
 * Przygotowuje szablony modułu w chwili dodania do aktora i scala umiejętności, które aktor już ma.
 */
import { MODULE_ID, I18N, log, t } from "./constants.mjs";
import { buildAvailability, buildNameMap, isAvailable, resolveName } from "./names.mjs";

const ITEM_TYPES = ["skill", "talent", "trait", "weapon", "armour", "trapping", "ammunition", "container"];

/** Cechy, których wartości się sumują; pozostałe przyjmują wyższą wartość. */
const ADDITIVE_TRAITS = ["Armour"];
const CORRUPTION_STRENGTH = { minor: "CORRUPTION.Minor", moderate: "CORRUPTION.Moderate", major: "CORRUPTION.Major" };
let nameMap = { names: new Map(), bases: new Map() };
let availability = {};

const isManaged = (item) => item?.type === "template" && item.flags?.[MODULE_ID]?.managed === true;

function specialisation(text) {
  const key = `${I18N}.Specialisations.${text}`;
  return game.i18n.has(key) ? game.i18n.localize(key) : text;
}

const translate = (name) => resolveName(name, nameMap, specialisation);

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

/** Dzieli cechy na nowe i te, które aktor już ma. Dla posiadanych z wartością liczbową zwraca ocenę z szablonu. */
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
    if (!Number.isNaN(rating) && !Number.isNaN(parseInt(current.value))) raise.push({ name: trait.name, rating });
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

function onPreCreateTemplate(item) {
  if (!isManaged(item) || !item.parent) return;
  const update = localizedSystem(item.toObject().system, translate, (key) => game.wfrp4e.config.magicLores[key] ?? key, specificationValue);
  const owned = new Set(item.parent.itemTypes.skill.map((skill) => skill.name));
  const { keep, merge } = splitOwnedSkills(update["system.skills.list"], owned);
  update["system.skills.list"] = keep;
  update[`flags.${MODULE_ID}.pendingSkills`] = merge.map(({ name, advances }) => ({ name, advances }));
  removeUnavailable(update, item.toObject().system, item.name, item.flags[MODULE_ID].optional ?? []);
  const ownedTraits = item.parent.itemTypes.trait.map((trait) => ({ name: trait.name, value: trait.system.specification.value }));
  const { keep: newTraits, raise } = splitOwnedTraits(update["system.traits.list"], ownedTraits);
  update["system.traits.list"] = newTraits;
  update[`flags.${MODULE_ID}.pendingTraits`] = raise;
  item.updateSource(update);
}

/** Podnosi rozwinięcia umiejętności, które aktor już ma, i zapamiętuje, ile dodał ten szablon. */
function onCreateTemplate(item, _options, userId) {
  if (!isManaged(item) || !item.parent || userId !== game.user.id) return;
  const skills = item.parent.itemTypes.skill;
  const updates = [];
  for (const { name, advances } of item.getFlag(MODULE_ID, "pendingSkills") ?? []) {
    const skill = skills.find((other) => other.name === name);
    if (!skill) continue;
    updates.push({
      _id: skill.id,
      "system.advances.value": skill.system.advances.value + advances,
      [`flags.${MODULE_ID}.merged.${item.id}`]: advances
    });
  }
  const additive = new Set(ADDITIVE_TRAITS.map(translate));
  for (const { name, rating } of item.getFlag(MODULE_ID, "pendingTraits") ?? []) {
    const trait = item.parent.itemTypes.trait.find((other) => other.name === name);
    if (!trait) continue;
    const base = trait.getFlag(MODULE_ID, "traitBase") ?? parseInt(trait.system.specification.value);
    const ratings = [...Object.values(trait.getFlag(MODULE_ID, "traitRatings") ?? {}), rating];
    updates.push({
      _id: trait.id,
      "system.specification.value": traitValue(base, ratings, additive.has(name)),
      [`flags.${MODULE_ID}.traitBase`]: base,
      [`flags.${MODULE_ID}.traitRatings.${item.id}`]: rating
    });
  }
  if (updates.length) item.parent.updateEmbeddedDocuments("Item", updates).catch((error) => log.error(error));
}

/** Po usunięciu szablonu cofa rozwinięcia dodane do istniejących umiejętności. */
function onDeleteTemplate(item, _options, userId) {
  if (!isManaged(item) || !item.parent || userId !== game.user.id) return;
  const updates = [];
  for (const skill of item.parent.itemTypes.skill) {
    const added = skill.getFlag(MODULE_ID, `merged.${item.id}`);
    if (!added) continue;
    updates.push({
      _id: skill.id,
      "system.advances.value": Math.max(0, skill.system.advances.value - added),
      [`flags.${MODULE_ID}.merged.${item.id}`]: 0
    });
  }
  const additive = new Set(ADDITIVE_TRAITS.map(translate));
  for (const trait of item.parent.itemTypes.trait) {
    const ratings = trait.getFlag(MODULE_ID, "traitRatings");
    if (!ratings?.[item.id]) continue;
    const others = Object.entries(ratings).filter(([id]) => id !== item.id).map(([, rating]) => rating);
    updates.push({
      _id: trait.id,
      "system.specification.value": traitValue(trait.getFlag(MODULE_ID, "traitBase"), others, additive.has(trait.name)),
      [`flags.${MODULE_ID}.traitRatings.${item.id}`]: 0
    });
  }
  if (updates.length) item.parent.updateEmbeddedDocuments("Item", updates).catch((error) => log.error(error));
}

export function installApplyHooks() {
  Hooks.on("preCreateItem", onPreCreateTemplate);
  Hooks.on("createItem", onCreateTemplate);
  Hooks.on("deleteItem", onDeleteTemplate);
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
