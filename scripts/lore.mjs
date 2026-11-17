/**
 * Jeden wybór tradycji magii (czyste funkcje).
 * System pyta osobno o Splatanie, talent magii, Nasycenie Wiatrem i tradycję czarów,
 * choć wszystkie wynikają z jednej tradycji. Tu jeden wybór ustawia je wszystkie.
 *
 * Tryby wyboru: "arcane" – osiem tradycji Kolegiów (magowie Imperium),
 * "any" – każda tradycja, która ma czary w aktywnych kompendiach (Czarownik dowolnej rasy).
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

/** Angielska specjalizacja talentu dla pozostałych tradycji zarejestrowanych przez system i dodatki. */
const LORE_SPECIALISATIONS = {
  hedgecraft: "Hedgecraft", witchcraft: "Witchcraft", daemonology: "Daemonology", necromancy: "Necromancy",
  undivided: "Undivided", nurgle: "Nurgle", slaanesh: "Slaanesh", tzeentch: "Tzeentch",
  dark: "Dark", greatMaw: "Great Maw", ruin: "Ruin", plague: "Plague", stealth: "Stealth"
};

/** Angielska nazwa tradycji (specjalizacja talentu) z klucza systemu; nieznany klucz wraca bez zmian. */
export function loreSpecialisation(key) {
  return ARCANE_LORES[key]?.talent ?? LORE_SPECIALISATIONS[key] ?? key;
}

/** Tradycje bogów Chaosu: talent Magia Chaosu zamiast Magii Tajemnej. */
const CHAOS_LORES = new Set(["undivided", "nurgle", "slaanesh", "tzeentch"]);

/** Tradycje czerpiące z Dhar (mroczna magia, Chaos, skaveni). */
const DHAR_LORES = new Set([...CHAOS_LORES, "daemonology", "necromancy", "dark", "ruin", "plague", "stealth"]);

/** Tradycje z własnym „Wiatrem” w specjalizacji Splatania (np. ogry). */
const OWN_CHANNELLING = { greatMaw: "Great Maw" };

const WIND_SKILL = /^Channelling( \(|$)/;
const MAGIC_TALENT = /^(Arcane Magic|Chaos Magic|High Magic)( \(|$)/;
const SUFFUSE_TALENT = /^Suffuse with /;

/** Numery grup wyboru, w których każda opcja pasuje do wzorca. */
function groupsMatching(list, pattern) {
  const groups = new Map();
  for (const { name, group } of list) {
    if (!group) continue;
    groups.set(group, (groups.get(group) ?? true) && pattern.test(name));
  }
  return new Set([...groups].filter(([, all]) => all).map(([group]) => group));
}

/** Czy szablon pyta o tradycję więcej niż raz: czary z dowolnej tradycji plus wybór Wiatru lub talentu magii. */
export function needsLoreChoice(system) {
  const anyLore = system.lores.list.some((lore) => lore.name === "*");
  const choices = [WIND_SKILL, MAGIC_TALENT, SUFFUSE_TALENT].reduce(
    (sum, pattern, index) => sum + groupsMatching(index ? system.talents.list : system.skills.list, pattern).size, 0);
  return anyLore && choices > 0;
}

/** Zamienia grupy wyboru pasujące do wzorca na jedną ustaloną pozycję (albo usuwa je, gdy brak wyboru). */
function settle(list, pattern, chosen) {
  const groups = groupsMatching(list, pattern);
  const result = [];
  const done = new Set();
  for (const entry of list) {
    if (!groups.has(entry.group)) {
      result.push(entry);
    } else if (chosen && !done.has(entry.group)) {
      done.add(entry.group);
      result.push({ ...entry, name: chosen, group: null });
    }
  }
  return result;
}

/**
 * Tradycje do wyboru z liczby czarów w aktywnych kompendiach.
 * @param {Map<string, number>} counts – wartość pola tradycji czaru → liczba czarów
 * @param {Object<string,string>} magicLores – game.wfrp4e.config.magicLores (etykiety już przetłumaczone)
 * @returns {{value: string, key: string|null, label: string}[]} value trafia do listy tradycji szablonu
 */
export function loreOptions(counts, magicLores) {
  const keys = Object.keys(magicLores);
  const keyOf = (value) => keys.find((key) => key === value) ?? keys.find((key) => key.toLowerCase() === value.toLowerCase()) ?? null;
  const options = new Map();
  for (const [value, count] of counts) {
    if (!value || value === "petty") continue;
    const key = keyOf(value);
    if (!key) {
      // Rytuały opisane tekstem („Any Lore”, „Death, Life, …”) i pojedyncze czary to nie tradycje
      if (/^any\b/i.test(value) || value.includes(",") || count < 2) continue;
      options.set(value, { value, key: null, label: value });
      continue;
    }
    // Ta sama tradycja zapisana inną wielkością liter: wygrywa zapis klucza, jeśli ma własne czary
    const current = options.get(key);
    if (current && (current.value === key || value !== key)) continue;
    options.set(key, { value, key, label: magicLores[key] });
  }
  const arcane = Object.keys(ARCANE_LORES);
  const rank = (option) => (arcane.includes(option.key) ? arcane.indexOf(option.key) : arcane.length);
  return [...options.values()].sort((a, b) => rank(a) - rank(b) || a.label.localeCompare(b.label));
}

/** Tradycje Kolegiów (tryb "arcane") w tej samej postaci co loreOptions. */
export function arcaneOptions(magicLores) {
  return Object.keys(ARCANE_LORES).filter((key) => magicLores[key]).map((key) => ({ value: key, key, label: magicLores[key] }));
}

/**
 * Co wynika z wybranej tradycji: tradycja czarów, Splatanie, talent magii i Nasycenie (nazwy angielskie).
 * @param {{value: string, key: string|null}} option
 */
export function loreProfile({ value, key }) {
  const arcane = ARCANE_LORES[key];
  if (arcane) {
    return { lore: value, channelling: `Channelling (${arcane.wind})`, talent: `Arcane Magic (${arcane.talent})`, suffuse: `Suffuse with ${arcane.wind}` };
  }
  const specialisation = LORE_SPECIALISATIONS[key] ?? value;
  let talent = `Arcane Magic (${specialisation})`;
  if (CHAOS_LORES.has(key)) talent = `Chaos Magic (${specialisation})`;
  else if (/high magic/i.test(value)) talent = "High Magic";
  let channelling = "Channelling";
  if (DHAR_LORES.has(key)) channelling = "Channelling (Dhar)";
  else if (OWN_CHANNELLING[key]) channelling = `Channelling (${OWN_CHANNELLING[key]})`;
  else if (/waaagh/i.test(value)) channelling = `Channelling (${value})`;
  return { lore: value, channelling, talent, suffuse: null };
}

/** Dane szablonu z ustaloną tradycją: Splatanie, talent magii, Nasycenie i czary z tej jednej tradycji. */
export function withLore(system, { lore, channelling, talent, suffuse }) {
  let talents = settle(system.talents.list, MAGIC_TALENT, talent);
  talents = settle(talents, SUFFUSE_TALENT, suffuse);
  return {
    ...system,
    skills: { ...system.skills, list: settle(system.skills.list, WIND_SKILL, channelling) },
    talents: { ...system.talents, list: talents },
    lores: { ...system.lores, list: system.lores.list.map((entry) => (entry.name === "*" ? { ...entry, name: lore } : entry)) }
  };
}
