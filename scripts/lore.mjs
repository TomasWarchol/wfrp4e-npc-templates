/**
 * Jeden wybór tradycji magii dla czarodzieja (czyste funkcje).
 * System pyta osobno o Splatanie, Magię Tajemną, Nasycenie Wiatrem i tradycję czarów,
 * choć wszystkie cztery wynikają z jednej tradycji. Tu jeden wybór ustawia je wszystkie.
 */

/** Tradycje tajemne (klucze z game.wfrp4e.config.magicLores) i ich Wiatry. */
export const ARCANE_LORES = {
  fire: { wind: "Aqshy", talent: "Fire" },
  heavens: { wind: "Azyr", talent: "Heavens" },
  metal: { wind: "Chamon", talent: "Metal" },
  beasts: { wind: "Ghur", talent: "Beasts" },
  life: { wind: "Ghyran", talent: "Life" },
  light: { wind: "Hysh", talent: "Light" },
  death: { wind: "Shyish", talent: "Death" },
  shadow: { wind: "Ulgu", talent: "Shadow" }
};

const WIND_SKILL = /^Channelling \(/;
const WIND_TALENTS = [/^Arcane Magic \(/, /^Suffuse with /];

/** Numery grup wyboru, w których każda opcja pasuje do wzorca. */
function groupsMatching(list, pattern) {
  const groups = new Map();
  for (const { name, group } of list) {
    if (!group) continue;
    groups.set(group, (groups.get(group) ?? true) && pattern.test(name));
  }
  return new Set([...groups].filter(([, all]) => all).map(([group]) => group));
}

/** Czy szablon pyta o tradycję więcej niż raz: czary z dowolnej tradycji plus wybór Wiatru lub Magii Tajemnej. */
export function needsLoreChoice(system) {
  const anyLore = system.lores.list.some((lore) => lore.name === "*");
  const windGroups = groupsMatching(system.skills.list, WIND_SKILL).size
    + WIND_TALENTS.reduce((sum, pattern) => sum + groupsMatching(system.talents.list, pattern).size, 0);
  return anyLore && windGroups > 0;
}

/** Zostawia z grup pasujących do wzorca tylko wybraną opcję, już bez okna wyboru. */
function pick(list, pattern, chosen) {
  const groups = groupsMatching(list, pattern);
  return list
    .filter((entry) => !groups.has(entry.group) || entry.name === chosen)
    .map((entry) => (groups.has(entry.group) ? { ...entry, group: null } : entry));
}

/** Dane szablonu z ustaloną tradycją: Splatanie, Magia Tajemna, Nasycenie i czary z tej jednej tradycji. */
export function withLore(system, lore) {
  const { wind, talent } = ARCANE_LORES[lore];
  let talents = pick(system.talents.list, WIND_TALENTS[0], `Arcane Magic (${talent})`);
  talents = pick(talents, WIND_TALENTS[1], `Suffuse with ${wind}`);
  return {
    ...system,
    skills: { ...system.skills, list: pick(system.skills.list, WIND_SKILL, `Channelling (${wind})`) },
    talents: { ...system.talents, list: talents },
    lores: { ...system.lores, list: system.lores.list.map((entry) => (entry.name === "*" ? { ...entry, name: lore } : entry)) }
  };
}
