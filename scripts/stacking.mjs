/**
 * Łączenie kilku szablonów na jednym aktorze (czyste funkcje).
 *
 * Tryby:
 *   "layers" – warstwy (domyślny): w obrębie jednej warstwy liczy się najwyższa premia, warstwy się sumują.
 *              Warstwą jest kategoria szablonu: rola, poziom zagrożenia, stopień archetypu, każda grupa cech
 *              (Ciało, Natura, Moce, Skażenie, Nieumarłość, Słabości) i każda grupa tła. Kary zawsze się sumują.
 *   "sum"    – wszystko się dodaje.
 *   "max"    – liczy się najwyższa premia i najsilniejsza kara.
 *
 * Umiejętność albo cecha stworzenia, którą zmienia szablon, pamięta wartość bazową aktora i wkład każdego
 * szablonu (flaga stack). Wynik zawsze liczy się od nowa z tych danych, więc kolejność nakładania i zdejmowania
 * jest obojętna. Przedmiot utworzony przez jeden szablon, a potrzebny też innemu, moduł przejmuje (adopted)
 * i usuwa dopiero wtedy, gdy nie potrzebuje go żaden szablon.
 */

export const MODES = ["layers", "sum", "max"];

const CHARACTERISTICS = ["ws", "bs", "s", "t", "i", "ag", "dex", "int", "wp", "fel"];

/**
 * Łączy wartości z kilku szablonów według trybu.
 * @param {{value: number, layer?: string}[]} entries – wartość i warstwa każdego szablonu
 */
export function combineValues(entries, mode = "layers") {
  const values = entries.map(({ value, layer }) => ({ value: Number(value) || 0, layer })).filter(({ value }) => value);
  const positives = values.filter(({ value }) => value > 0);
  const negatives = values.filter(({ value }) => value < 0);
  const sumOf = (list) => list.reduce((sum, { value }) => sum + value, 0);
  if (mode === "sum") return sumOf(values);
  if (mode === "max") return Math.max(0, ...positives.map(({ value }) => value)) + Math.min(0, ...negatives.map(({ value }) => value));
  const best = new Map();
  for (const { value, layer } of positives) best.set(layer ?? Symbol("layer"), Math.max(best.get(layer) ?? 0, value));
  return [...best.values()].reduce((sum, value) => sum + value, 0) + sumOf(negatives);
}

/**
 * Modyfikatory cech z kilku szablonów.
 * @param {Object<string, number>[]} list – characteristics kolejnych szablonów
 * @param {string[]} [layers] – warstwa każdego szablonu (ta sama kolejność); bez warstwy szablon jest osobną warstwą
 */
export function combineCharacteristics(list, mode = "layers", layers = []) {
  const result = {};
  for (const key of CHARACTERISTICS) {
    result[key] = combineValues(list.map((characteristics, index) => ({ value: characteristics?.[key], layer: layers[index] ?? `#${index}` })), mode);
  }
  return result;
}

/**
 * Wartość z bazy aktora i wkładów szablonów.
 * Umiejętności: baza aktora to osobna warstwa, do której dochodzą szablony według trybu ("max": najwyższa z bazy i szablonów).
 * Cechy stworzeń biorą najwyższą wartość; Pancerz (additive) łączy się jak umiejętności.
 * @param {number} base
 * @param {Object<string, number>} ratings – id szablonu → wkład
 * @param {{mode?: string, kind?: "skill"|"trait", additive?: boolean, layers?: Object<string, string>}} options – layers: id szablonu → warstwa
 */
export function stackedValue(base, ratings, { mode = "layers", kind = "skill", additive = false, layers = {} } = {}) {
  const start = Number(base) || 0;
  const entries = Object.entries(ratings ?? {}).map(([id, value]) => ({ value: Math.max(0, Number(value) || 0), layer: layers[id] ?? id }));
  const values = entries.map(({ value }) => value);
  if (mode === "max" || (kind === "trait" && !additive)) return Math.max(start, ...values);
  return start + combineValues(entries, mode);
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
 * Ile wykupień każdego talentu wymagają razem szablony, według trybu.
 * @param {{id: string, needs: Object<string, number>, layer?: string}[]} templates
 * @returns {Map<string, {count: number, templateId: string}>} – templateId: szablon o największym wymaganiu
 */
export function talentRequirements(templates, mode = "layers") {
  const perName = new Map();
  for (const { id, needs, layer } of templates) {
    for (const [name, count] of Object.entries(needs ?? {})) {
      if (!perName.has(name)) perName.set(name, []);
      perName.get(name).push({ value: count, layer: layer ?? id, id });
    }
  }
  const result = new Map();
  for (const [name, entries] of perName) {
    const owner = entries.reduce((best, entry) => (entry.value > best.value ? entry : best));
    result.set(name, { count: combineValues(entries, mode), templateId: owner.id });
  }
  return result;
}

/**
 * Talenty, które szablon jeszcze musi dodać (tryby "max" i "layers"): różnica między wymaganiem
 * a liczbą wykupień, które aktor już ma. Bez podanych wymagań liczy się samo wymaganie szablonu.
 * @param {{name: string, advances: number, group: number|null}[]} list – talenty szablonu (nazwy już w aktywnym tłumaczeniu)
 * @param {Map<string, number>} owned – nazwa → liczba posiadanych wykupień
 * @param {Map<string, {count: number}>} [required] – nazwa → łączne wymaganie wszystkich szablonów
 */
export function missingTalents(list, owned, required = null) {
  const result = [];
  for (const entry of list) {
    if (entry.group) {
      result.push(entry);
      continue;
    }
    const need = required?.get(entry.name)?.count ?? entry.advances;
    const missing = Math.min(entry.advances, need - (owned.get(entry.name) ?? 0));
    if (missing > 0) result.push({ ...entry, advances: missing });
  }
  return result;
}

/**
 * Talenty do dodania po zdjęciu szablonu: pozostałe szablony dostają z powrotem tyle wykupień,
 * ile razem wymagają, jeśli aktor ma ich za mało.
 * @param {{id: string, needs: Object<string, number>, layer?: string}[]} templates – pozostałe szablony
 * @param {Map<string, number>} owned – nazwa → liczba posiadanych wykupień
 * @returns {{templateId: string, name: string, count: number}[]}
 */
export function talentsToRestore(templates, owned, mode = "max") {
  const result = [];
  for (const [name, { count, templateId }] of talentRequirements(templates, mode)) {
    const missing = count - (owned.get(name) ?? 0);
    if (missing > 0) result.push({ templateId, name, count: missing });
  }
  return result;
}

/**
 * Przewidywana wartość umiejętności po nałożeniu szablonu (do podglądu w Kuźni).
 * @param {number|null} current – obecne rozwinięcia (null, gdy aktor nie ma umiejętności)
 * @param {{stack?: {base: number, ratings: object}|null, layers?: Object<string,string>, layer?: string}} [context]
 *   – stan łączenia umiejętności i warstwy szablonów; bez niego umiejętność aktora to sama baza
 */
export function projectSkill(current, advances, mode = "layers", { stack = null, layers = {}, layer = "new" } = {}) {
  if (current === null || current === undefined) return advances;
  const base = stack ? stack.base : current;
  const ratings = { ...(stack?.ratings ?? {}), __preview: advances };
  return stackedValue(base, ratings, { mode, kind: "skill", layers: { ...layers, __preview: layer } });
}
