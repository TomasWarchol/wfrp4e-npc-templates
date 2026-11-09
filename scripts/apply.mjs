/**
 * Przygotowuje szablony modułu w chwili dodania do aktora i scala umiejętności, które aktor już ma.
 */
import { MODULE_ID, I18N, log } from "./constants.mjs";
import { buildNameMap, resolveName } from "./names.mjs";

const ITEM_TYPES = ["skill", "talent", "weapon", "armour", "trapping", "ammunition", "container"];
let nameMap = { names: new Map(), bases: new Map() };

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
  log.info(`nazwy gotowe: ${nameMap.names.size}`);
}

/** Dane szablonu z nazwami w aktywnym tłumaczeniu. */
export function localizedSystem(system, translateName, loreLabel) {
  const named = (entry) => ({ ...entry, name: translateName(entry.name) });
  return {
    "system.skills.list": system.skills.list.map(named),
    "system.talents.list": system.talents.list.map(named),
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

function onPreCreateTemplate(item) {
  if (!isManaged(item) || !item.parent) return;
  const update = localizedSystem(item.toObject().system, translate, (key) => game.wfrp4e.config.magicLores[key] ?? key);
  const owned = new Set(item.parent.itemTypes.skill.map((skill) => skill.name));
  const { keep, merge } = splitOwnedSkills(update["system.skills.list"], owned);
  update["system.skills.list"] = keep;
  update[`flags.${MODULE_ID}.pendingSkills`] = merge.map(({ name, advances }) => ({ name, advances }));
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
      missing.push(`${template.name}: ${name}`);
    }
  };
  for (const template of await pack.getDocuments()) {
    const { skills, talents, trappings } = template.system;
    for (const skill of skills.list) await find(game.wfrp4e.utility.findSkill.bind(game.wfrp4e.utility), template, skill.name);
    for (const talent of talents.list) await find(game.wfrp4e.utility.findTalent.bind(game.wfrp4e.utility), template, talent.name);
    for (const option of trappings.options) {
      if (!await fromUuid(option.documentId)) missing.push(`${template.name}: ${option.name}`);
    }
  }
  return missing;
}
