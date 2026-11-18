/**
 * Łączenie kilku szablonów na jednym aktorze (czyste funkcje).
 *
 * Tryby: "sum" – wartości z szablonów się dodają (jak dotąd), "max" – liczy się najwyższa wartość.
 * Umiejętność albo cecha stworzenia, którą zmienia szablon, pamięta wartość bazową aktora i wkład każdego
 * szablonu (flaga stack). Wynik zawsze liczy się od nowa z tych danych, więc kolejność nakładania i zdejmowania
 * jest obojętna. Przedmiot utworzony przez jeden szablon, a potrzebny też innemu, moduł przejmuje (adopted)
 * i usuwa dopiero wtedy, gdy nie potrzebuje go żaden szablon.
 */

export const MODES = ["sum", "max"];

const CHARACTERISTICS = ["ws", "bs", "s", "t", "i", "ag", "dex", "int", "wp", "fel"];

/**
 * Modyfikatory cech z kilku szablonów. W trybie "max" liczy się najwyższa premia i najsilniejsza kara
 * (kara nie znika pod premią z innego szablonu).
 * @param {Object<string, number>[]} list – characteristics kolejnych szablonów
 */
export function combineCharacteristics(list, mode = "sum") {
  const result = {};
  for (const key of CHARACTERISTICS) {
    const values = list.map((characteristics) => Number(characteristics?.[key]) || 0).filter(Boolean);
    if (mode === "max") {
      result[key] = Math.max(0, ...values) + Math.min(0, ...values);
    } else {
      result[key] = values.reduce((sum, value) => sum + value, 0);
    }
  }
  return result;
}

/**
 * Wartość z bazy aktora i wkładów szablonów.
 * Umiejętności w trybie "sum" sumują się z bazą, cechy stworzeń biorą najwyższą wartość (poza Pancerzem, który się sumuje).
 * W trybie "max" wszystko bierze najwyższą wartość.
 * @param {number} base
 * @param {Object<string, number>} ratings – id szablonu → wkład
 * @param {{mode?: string, kind?: "skill"|"trait", additive?: boolean}} options
 */
export function stackedValue(base, ratings, { mode = "sum", kind = "skill", additive = false } = {}) {
  const values = Object.values(ratings ?? {}).map(Number).filter((value) => value > 0);
  const start = Number(base) || 0;
  if (mode === "max") return Math.max(start, ...values);
  if (kind === "skill" || additive) return values.reduce((sum, value) => sum + value, start);
  return Math.max(start, ...values);
}

/**
 * Stan łączenia zapisany w przedmiocie. Odczytuje też flagi z wersji 0.4–0.5:
 * umiejętności miały merged.{szablon}: dodane rozwinięcia, cechy stworzeń traitBase i traitRatings.
 * @param {{kind: "skill"|"trait", value: number, flags: object}} item – flags to flagi modułu
 */
export function readStack({ kind, value, flags = {} }) {
  if (flags.stack) return { base: Number(flags.stack.base) || 0, ratings: { ...(flags.stack.ratings ?? {}) }, adopted: !!flags.stack.adopted };
  if (kind === "skill" && flags.merged) {
    const ratings = Object.fromEntries(Object.entries(flags.merged).filter(([, added]) => added > 0));
    const added = Object.values(ratings).reduce((sum, amount) => sum + amount, 0);
    return { base: Math.max(0, value - added), ratings, adopted: false, legacy: true };
  }
  if (kind === "trait" && flags.traitRatings) {
    const ratings = Object.fromEntries(Object.entries(flags.traitRatings).filter(([, rating]) => rating > 0));
    return { base: Number(flags.traitBase) || 0, ratings, adopted: false };
  }
  return null;
}

/**
 * Stan po dodaniu wkładu szablonu. Przedmiot utworzony przez inny szablon (ownerTemplate) zostaje przejęty:
 * baza 0, a dotychczasowa wartość staje się wkładem tamtego szablonu.
 */
export function addRating(stack, { templateId, rating, value, ownerTemplate = null }) {
  if (stack) return { ...stack, ratings: { ...stack.ratings, [templateId]: rating } };
  if (ownerTemplate) return { base: 0, ratings: { [ownerTemplate]: value, [templateId]: rating }, adopted: true };
  return { base: value, ratings: { [templateId]: rating }, adopted: false };
}

/** Stan po zdjęciu szablonu; remove = przejęty przedmiot, którego nie potrzebuje już żaden szablon. */
export function removeRating(stack, templateId) {
  const ratings = { ...stack.ratings };
  delete ratings[templateId];
  return { stack: { base: stack.base, ratings, adopted: stack.adopted }, remove: stack.adopted && !Object.keys(ratings).length };
}

/**
 * Talenty, których szablon jeszcze potrzebuje w trybie "max": różnica między liczbą wykupień z szablonu
 * a liczbą, którą aktor już ma.
 * @param {{name: string, advances: number, group: number|null}[]} list – talenty szablonu (nazwy już w aktywnym tłumaczeniu)
 * @param {Map<string, number>} owned – nazwa → liczba posiadanych wykupień
 */
export function missingTalents(list, owned) {
  const result = [];
  for (const entry of list) {
    if (entry.group) {
      result.push(entry);
      continue;
    }
    const missing = entry.advances - (owned.get(entry.name) ?? 0);
    if (missing > 0) result.push({ ...entry, advances: missing });
  }
  return result;
}

/**
 * Talenty do dodania po zdjęciu szablonu w trybie "max": każdy pozostały szablon dostaje z powrotem
 * tyle wykupień, ile wymaga, jeśli aktor ma ich za mało.
 * @param {{id: string, needs: Object<string, number>}[]} templates – pozostałe szablony i ich wymagania
 * @param {Map<string, number>} owned – nazwa → liczba posiadanych wykupień
 * @returns {{templateId: string, name: string, count: number}[]}
 */
export function talentsToRestore(templates, owned) {
  const required = new Map();
  for (const { id, needs } of templates) {
    for (const [name, count] of Object.entries(needs ?? {})) {
      if (count > (required.get(name)?.count ?? 0)) required.set(name, { templateId: id, count });
    }
  }
  const result = [];
  for (const [name, { templateId, count }] of required) {
    const missing = count - (owned.get(name) ?? 0);
    if (missing > 0) result.push({ templateId, name, count: missing });
  }
  return result;
}

/**
 * Przewidywana wartość umiejętności po nałożeniu szablonu (do podglądu w Kuźni).
 * W trybie "max" obecna wartość jest już maksimum z bazy i szablonów, więc wystarczy porównać z nowym wkładem.
 */
export function projectSkill(current, advances, mode = "sum") {
  if (current === null || current === undefined) return advances;
  return mode === "max" ? Math.max(current, advances) : current + advances;
}
