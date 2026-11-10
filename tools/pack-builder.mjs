/**
 * Zamienia zapis z content/templates.mjs na dokumenty kompendium i plik tłumaczenia (czyste funkcje).
 */
import { createHash } from "node:crypto";

export const PACK_NAME = "npc-templates";
export const MODULE_ID = "wfrp4e-npc-templates";

const CHARACTERISTICS = ["ws", "bs", "s", "t", "i", "ag", "dex", "int", "wp", "fel"];

/** Stały identyfikator dokumentu: ten sam klucz daje to samo id w każdej wersji modułu. */
export function stableId(key) {
  return createHash("sha1").update(key).digest("hex").slice(0, 16);
}

function addNumbers(target, source = {}) {
  for (const [key, value] of Object.entries(source)) target[key] = (target[key] ?? 0) + value;
  return target;
}

/** Sumuje stopnie archetypu do stopnia `index` włącznie. */
export function accumulateRank(ranks, index) {
  const total = { c: {}, s: {}, t: [], sc: [], tc: [], l: {} };
  for (const rank of ranks.slice(0, index + 1)) {
    addNumbers(total.c, rank.c);
    addNumbers(total.s, rank.s);
    addNumbers(total.l, rank.l);
    total.t.push(...(rank.t ?? []));
    for (const choice of rank.sc ?? []) {
      // Ten sam wybór na kolejnym stopniu podnosi rozwinięcia zamiast pytać drugi raz
      const same = total.sc.find((other) => other.of.join() === choice.of.join());
      if (same) same.adv += choice.adv;
      else total.sc.push({ ...choice });
    }
    total.tc.push(...(rank.tc ?? []));
  }
  return { ...total, gear: ranks[index].gear ?? [] };
}

/** Lista talentów: powtórzona nazwa to kolejne wykupienie. */
function talentList(names, choices) {
  const counted = new Map();
  for (const name of names) counted.set(name, (counted.get(name) ?? 0) + 1);
  const list = [...counted].map(([name, advances]) => ({ name, advances, group: null }));
  choices.forEach((options, index) => {
    for (const name of options) list.push({ name, advances: 1, group: index + 1 });
  });
  return list;
}

function skillList(skills, choices) {
  const list = Object.entries(skills).map(([name, advances]) => ({ name, advances, group: null }));
  choices.forEach((choice, index) => {
    for (const name of choice.of) list.push({ name, advances: choice.adv, group: index + 1 });
  });
  return list;
}

function loreList(lores) {
  const list = [];
  if (lores.petty) list.push({ name: "petty", number: lores.petty });
  if (lores.any) list.push({ name: "*", number: lores.any });
  return list;
}

function parseGear(entry) {
  const [name, quantity] = entry.split("*");
  return { name, quantity: quantity ? Number(quantity) : null };
}

/** Wyposażenie w formacie ChoiceModel: korzeń "and", a tablica w zapisie to gałąź "or". */
export function buildTrappings(gear, coreItems, key) {
  const options = [];
  const option = (entry, index) => {
    const { name, quantity } = parseGear(entry);
    const id = coreItems[name];
    if (!id) throw new Error(`Nieznany przedmiot "${name}" w szablonie ${key}`);
    const optionId = stableId(`${key}/${index}/${name}`);
    options.push({
      type: "item", id: optionId, name, idType: "uuid", filters: [],
      documentId: `Compendium.wfrp4e-core.items.Item.${id}`,
      diff: quantity ? { system: { quantity: { value: quantity } } } : {}
    });
    return { type: "option", id: optionId };
  };
  const structure = {
    type: "and", id: "root",
    options: gear.map((entry, index) => (Array.isArray(entry)
      ? { type: "or", id: stableId(`${key}/or/${index}`), options: entry.map((e, i) => option(e, `${index}.${i}`)) }
      : option(entry, index)))
  };
  return { structure, options, script: "" };
}

/** Cechy stworzeń jako odwołania do kompendium; wartość trafia do diff, a system pyta o nią tylko, gdy jej brak. */
export function buildTraits(traits, coreTraits, key) {
  return traits.map((entry) => {
    const [name, value, extra] = Array.isArray(entry) ? entry : [entry];
    const id = coreTraits[name];
    if (!id) throw new Error(`Nieznana cecha "${name}" w szablonie ${key}`);
    const diff = {};
    if (value !== undefined) diff.system = { specification: { value: String(value) } };
    if (extra?.breath) diff.flags = { wfrp4e: { breath: extra.breath } };
    return { id, uuid: `Compendium.wfrp4e-core.items.Item.${id}`, name, diff };
  });
}

/** Stałe zaklęcia i modlitwy jako odwołania do kompendium; dodaje je moduł po nałożeniu szablonu. */
export function buildSpellLinks(names, coreItems, key) {
  return names.map((name) => {
    const id = coreItems[name];
    if (!id) throw new Error(`Nieznane zaklęcie "${name}" w szablonie ${key}`);
    return `Compendium.wfrp4e-core.items.Item.${id}`;
  });
}

function buildItem({ key, en, icon, folder, sort, data, description, pre, post, coreItems, coreTraits, addonTalents }) {
  const characteristics = Object.fromEntries(CHARACTERISTICS.map((c) => [c, data.c[c] ?? 0]));
  const _id = stableId(key);
  return {
    _id, _key: `!items!${_id}`, name: en, type: "template", img: icon, folder, sort,
    system: {
      description: { value: `<p>${description}</p>` },
      gmdescription: { value: "" },
      alterName: { pre: pre ?? "", post: post ?? "" },
      characteristics,
      skills: { list: skillList(data.s, data.sc) },
      talents: { list: talentList(data.t, data.tc) },
      lores: { list: loreList(data.l) },
      traits: { list: buildTraits(data.tr ?? [], coreTraits, key) },
      trappings: buildTrappings(data.gear, coreItems, key)
    },
    effects: [],
    flags: { [MODULE_ID]: { managed: true, spells: buildSpellLinks(data.sp ?? [], coreItems, key), optional: [...new Set([...data.t, ...data.tc.flat()])].filter((name) => addonTalents.has(name)) } }
  };
}

function buildFolder(group, sort, parent = null) {
  const _id = stableId(`folder/${group.id}`);
  return { _id, _key: `!folders!${_id}`, name: group.en, type: "Item", sorting: "m", sort, folder: parent, color: null, description: "" };
}

const CATEGORIES = {
  roles: { id: "roles", en: "Roles", pl: "Role" },
  tiers: { id: "tiers", en: "Threat Level", pl: "Poziom zagrożenia" },
  traits: { id: "traits", en: "Traits", pl: "Cechy" },
  people: { id: "people", en: "People", pl: "Ludzie" }
};

/** Składa dokumenty kompendium i polskie tłumaczenie. */
export function buildAll({ archetypes, humanGroups = [], roleGroups = [], tierGroups = [], traitGroups = [], coreItems, coreTraits = {}, addonTalents = [] }) {
  const addons = new Set(addonTalents);
  const folders = [];
  const items = [];
  const entries = {};
  const folderNames = {};

  const add = (group, source, index, data) => {
    const key = `${group.id}/${source.id}`;
    items.push(buildItem({
      key, en: source.en, icon: group.icon, folder: stableId(`folder/${group.id}`), sort: (index + 1) * 1000,
      data, description: source.d[0], pre: source.pre?.[0], post: source.post?.[0], coreItems, coreTraits, addonTalents: addons
    }));
    if (entries[source.en]) throw new Error(`Powtórzona nazwa szablonu: ${source.en}`);
    entries[source.en] = { name: source.pl, description: `<p>${source.d[1]}</p>`, ...(source.pre ? { pre: source.pre[1] } : {}), ...(source.post ? { post: source.post[1] } : {}) };
  };

  const overlay = (item) => ({ c: item.c, s: item.s, t: item.t, sc: item.sc ?? [], tc: item.tc ?? [], l: item.l ?? {}, gear: item.gear ?? [], tr: item.tr ?? [], sp: item.sp ?? [] });

  const addCategory = (category, groups, sort) => {
    folders.push(buildFolder(category, sort));
    folderNames[category.en] = category.pl;
    groups.forEach((group, index) => {
      folders.push(buildFolder(group, (index + 1) * 1000, stableId(`folder/${category.id}`)));
      if (folderNames[group.en]) throw new Error(`Powtórzona nazwa folderu: ${group.en}`);
      folderNames[group.en] = group.pl;
    });
  };
  addCategory(CATEGORIES.roles, roleGroups, 1000);
  addCategory(CATEGORIES.tiers, tierGroups, 2000);
  addCategory(CATEGORIES.traits, traitGroups, 3000);
  addCategory(CATEGORIES.people, [...archetypes, ...humanGroups], 4000);

  for (const group of archetypes) {
    group.ranks.forEach((rank, index) => add(group, rank, index, accumulateRank(group.ranks, index)));
  }
  for (const group of [...roleGroups, ...tierGroups, ...traitGroups, ...humanGroups]) {
    group.items.forEach((item, index) => add(group, item, index, overlay(item)));
  }

  const translation = {
    label: "Szablony NPC",
    mapping: { description: "system.description.value", pre: "system.alterName.pre", post: "system.alterName.post" },
    folders: folderNames,
    entries
  };
  return { folders, items, translation };
}
