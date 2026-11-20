/**
 * Logika Kuźni przeciwnika i odznaki MG (czyste funkcje, bez Foundry).
 */
import { needsDeityChoice, withDeity } from "./deity.mjs";
import { needsLoreChoice, withLore } from "./lore.mjs";
import { combineCharacteristics, projectSkill } from "./stacking.mjs";

export const ROMAN = ["I", "II", "III", "IV", "V"];

/** Kolejność kategorii w panelu (id z flagi szablonu). */
export const CATEGORIES = ["roles", "tiers", "traits", "people"];

/** Kolory tierów: od szarego (I) do czerwonego (V). */
export const TIER_COLORS = [0x8a8a8a, 0x3f8f4f, 0x2f6fb0, 0x7a3fb0, 0xb03a2e];

/** Cyfra rzymska tieru albo pusty tekst dla nieznanego. */
export function romanTier(tier) {
  return ROMAN[tier - 1] ?? "";
}

/** Nazwa szablonu bez dopisku tieru, np. "Boss (Tier IV)" → "Boss". */
export function stripTier(name) {
  return String(name).replace(/\s*\(Tier [IVX]+\)$/, "");
}

/** Usuwa polskie znaki i wielkość liter, żeby wyszukiwanie było odporne na pisownię. */
function fold(text) {
  return String(text).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L").toLowerCase();
}

/**
 * Szablony widoczne w panelu.
 * @param {{name: string, tier: number, category: string, group: string}[]} entries
 * @param {{search?: string, category?: string, tiers?: Set<number>}} filter – category "all" albo id kategorii; pusty zbiór tierów = wszystkie
 */
export function filterTemplates(entries, { search = "", category = "all", tiers = new Set() } = {}) {
  const words = fold(search).split(/\s+/).filter(Boolean);
  return entries.filter((entry) => {
    if (category !== "all" && entry.category !== category) return false;
    if (tiers.size && !tiers.has(entry.tier)) return false;
    const haystack = fold(`${stripTier(entry.name)} ${entry.group ?? ""}`);
    return words.every((word) => haystack.includes(word));
  });
}

/**
 * Podsumowanie szablonów nałożonych na aktora: najwyższy tier, liczba i lista od najsilniejszego.
 * @param {{name: string, tier?: number}[]} templates
 */
export function summarizeStack(templates) {
  const list = templates
    .map((template) => ({ name: stripTier(template.name), tier: template.tier ?? 0 }))
    .sort((a, b) => b.tier - a.tier || a.name.localeCompare(b.name));
  const tier = list.reduce((max, entry) => Math.max(max, entry.tier), 0);
  return { tier, count: list.length, list, signature: list.map((entry) => `${entry.tier}:${entry.name}`).join("|") };
}

/**
 * Dopiski w imieniu według ustawienia: "all" – tytuł i rola, "titles" – tylko tytuł przed imieniem (np. „Sierżant”),
 * "none" – imię bez zmian. Rola w nawiasie zdradza graczom, kim jest przeciwnik, więc domyślnie znika.
 */
export function affixesFor(mode, { pre = "", post = "" } = {}) {
  if (mode === "all") return { pre, post };
  if (mode === "none") return { pre: "", post: "" };
  return { pre, post: "" };
}

/**
 * Cele z zaznaczonych tokenów: każdy aktor raz. Tokeny połączone z tym samym aktorem zmienią się wszystkie naraz,
 * więc zwracamy też, ile tokenów dzieli aktora z innym.
 * @param {{actor: {uuid: string}|null}[]} tokens
 */
export function uniqueTargets(tokens) {
  const actors = new Map();
  let shared = 0;
  for (const token of tokens) {
    if (!token.actor) continue;
    if (actors.has(token.actor.uuid)) shared += 1;
    else actors.set(token.actor.uuid, token.actor);
  }
  return { actors: [...actors.values()], shared };
}

const CHARACTERISTICS = ["ws", "bs", "s", "t", "i", "ag", "dex", "int", "wp", "fel"];

/** Lista z grupami wyboru: zwykłe pozycje jako tekst, grupa jako { oneOf: [...] } w miejscu pierwszej opcji. */
function withChoices(list, format) {
  const result = [];
  const groups = new Map();
  for (const entry of list) {
    if (!entry.group) {
      result.push(format(entry));
      continue;
    }
    if (!groups.has(entry.group)) {
      groups.set(entry.group, { oneOf: [] });
      result.push(groups.get(entry.group));
    }
    groups.get(entry.group).oneOf.push(format(entry));
  }
  return result;
}

/**
 * Czytelny opis szablonu do podglądu w Kuźni.
 * @param {object} system – dane szablonu (system z dokumentu)
 * @param {object} [flags] – flagi modułu (spells, loreChoice)
 * @param {{translate?: (name: string) => string, abbrev?: Object<string,string>, spellName?: (uuid: string) => string,
 *   specification?: (value: string) => string, affixMode?: string, deityLabel?: string}} [options] – affixMode jak ustawienie dopisków w imieniu
 */
export function describeTemplate(source, flags = {}, { translate = (name) => name, abbrev = {}, spellName = (uuid) => uuid, specification = (value) => value, affixMode = "all", deityLabel = "?" } = {}) {
  // Jak przy nakładaniu: jeden wybór tradycji zastępuje osobne wybory Splatania, talentu magii i Nasycenia,
  // a jeden wybór bóstwa – osobne Błogosławieństwo i Inwokację
  const chooseLore = needsLoreChoice(source);
  const chooseDeity = needsDeityChoice(source);
  let system = source;
  if (chooseLore) system = withLore(system, { lore: "*", channelling: null, talent: null, suffuse: null });
  if (chooseDeity) system = withDeity(system, deityLabel);
  const characteristics = CHARACTERISTICS
    .filter((key) => system.characteristics?.[key])
    .map((key) => {
      const value = system.characteristics[key];
      return { label: abbrev[key] ?? key.toUpperCase(), value: value > 0 ? `+${value}` : String(value) };
    });
  const skills = withChoices(system.skills?.list ?? [], ({ name, advances }) => `${translate(name)} +${advances}`);
  const talents = withChoices(system.talents?.list ?? [], ({ name, advances }) => (advances > 1 ? `${translate(name)} ×${advances}` : translate(name)));
  const traits = (system.traits?.list ?? []).map(({ name, diff }) => {
    const value = diff?.system?.specification?.value;
    return value ? `${translate(name)} ${specification(value)}` : translate(name);
  });
  const options = new Map((system.trappings?.options ?? []).map((option) => [option.id, option]));
  const gearName = (id) => {
    const option = options.get(id);
    if (!option) return null;
    const quantity = option.diff?.system?.quantity?.value;
    return quantity ? `${translate(option.name)} ×${quantity}` : translate(option.name);
  };
  const trappings = (system.trappings?.structure?.options ?? []).map((node) => (node.type === "or"
    ? { oneOf: node.options.map((child) => gearName(child.id)).filter(Boolean) }
    : gearName(node.id))).filter(Boolean);
  const lores = (system.lores?.list ?? []).map(({ name, number }) => ({ lore: name, number }));
  const spells = (flags.spells ?? []).map(spellName);
  const { pre, post } = affixesFor(affixMode, system.alterName ?? {});
  return { characteristics, skills, talents, traits, trappings, lores, spells, pre, post, loreChoice: flags.loreChoice ?? null, chooseLore, chooseDeity };
}

/**
 * Cechy aktora teraz i po nałożeniu podglądanego szablonu, według trybu łączenia.
 * @param {Object<string, number>} values – obecne wartości cech aktora (z modyfikatorami szablonów)
 * @param {Object<string, number>[]} applied – modyfikatory szablonów modułu nałożonych na aktora
 * @param {Object<string, number>|null} preview – modyfikatory podglądanego szablonu
 * @param {{layers?: string[], previewLayer?: string}} [options] – warstwy nałożonych szablonów (kolejność jak applied) i podglądanego
 * @returns {{key: string, value: number, fromTemplates: number, projected: number|null}[]}
 */
export function projectCharacteristics(values, applied, preview, mode = "layers", { layers = [], previewLayer = "preview" } = {}) {
  const current = combineCharacteristics(applied, mode, layers);
  const next = preview ? combineCharacteristics([...applied, preview], mode, [...layers, previewLayer]) : current;
  return CHARACTERISTICS.map((key) => {
    const value = Number(values?.[key]) || 0;
    const projected = preview ? value - current[key] + next[key] : null;
    return { key, value, fromTemplates: current[key], projected: projected === value ? null : projected };
  });
}

/**
 * Umiejętności z rozwinięciami teraz i po nałożeniu podglądanego szablonu. Pokazuje rozwinięte umiejętności aktora
 * i wszystkie, które doda szablon (wybory „jedno z” pomija, bo zależą od decyzji przy nakładaniu).
 * @param {{name: string, advances: number, stack?: object|null}[]} owned – umiejętności aktora (nazwy w aktywnym tłumaczeniu) ze stanem łączenia
 * @param {{name: string, advances: number}[]} added – umiejętności szablonu bez grup wyboru (nazwy w aktywnym tłumaczeniu)
 * @param {{layers?: Object<string,string>, layer?: string}} [context] – warstwy nałożonych szablonów i warstwa podglądanego
 */
export function projectSkills(owned, added = [], mode = "layers", { layers = {}, layer = "preview" } = {}) {
  const rows = new Map();
  for (const { name, advances } of owned) if (advances > 0) rows.set(name, { name, advances, projected: null });
  for (const { name, advances } of added) {
    const current = owned.find((skill) => skill.name === name);
    const before = current ? current.advances : null;
    const projected = projectSkill(before, advances, mode, { stack: current?.stack ?? null, layers, layer });
    if (projected === before) continue;
    rows.set(name, { name, advances: before, projected });
  }
  return [...rows.values()].sort((a, b) => a.name.localeCompare(b.name));
}
