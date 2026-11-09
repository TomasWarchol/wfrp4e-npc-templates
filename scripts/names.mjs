/**
 * Szablony zapisują nazwy po angielsku, a system szuka talentów i umiejętności po nazwie widocznej w kompendium.
 * Tu powstaje mapa "nazwa angielska -> nazwa w aktywnym tłumaczeniu".
 */

const SPECIALISED = /^(.*?)\s*\((.*)\)\s*$/;

function baseOf(name) {
  return name.match(SPECIALISED)?.[1] ?? name.trim();
}

/** Buduje mapę z pozycji indeksu kompendium; Babele zostawia w nich oryginalną nazwę. */
export function buildNameMap(entries) {
  const names = new Map();
  const bases = new Map();
  for (const entry of entries) {
    const original = entry.originalName ?? entry.flags?.babele?.originalName ?? entry.name;
    if (!names.has(original)) names.set(original, entry.name);
    if (!bases.has(baseOf(original))) bases.set(baseOf(original), baseOf(entry.name));
  }
  return { names, bases };
}

/** Zbiory nazw dostępnych w aktywnych kompendiach, osobno dla każdego typu przedmiotu. */
export function buildAvailability(entries) {
  const available = {};
  for (const { type, name } of entries) {
    available[type] ??= { names: new Set(), bases: new Set() };
    available[type].names.add(name);
    available[type].bases.add(baseOf(name));
  }
  return available;
}

/** Tak samo jak system: pasuje nazwa dokładna albo podstawa nazwy przed specjalizacją. */
export function isAvailable(name, entry) {
  return !!entry && (entry.names.has(name) || entry.bases.has(baseOf(name)));
}

/** Zwraca nazwę w aktywnym tłumaczeniu; nieznana nazwa wraca bez zmian. */
export function resolveName(name, { names, bases }, specialisation = (text) => text) {
  if (names.has(name)) return names.get(name);
  const match = name.match(SPECIALISED);
  if (match && bases.has(match[1])) return `${bases.get(match[1])} (${specialisation(match[2])})`;
  return name;
}
