/**
 * Jeden wybór bóstwa dla kapłana (czyste funkcje).
 * Szablon kapłana wojownika ma osobne wybory Błogosławieństwa i Inwokacji, a oba dotyczą tego samego boga.
 * Tu jeden wybór ustawia wszystkie talenty bóstwa naraz.
 */

const DEITY_TALENT = /^(Bless|Invoke) \((.+)\)$/;

/** Grupy wyboru talentów, w których każda opcja to Błogosławieństwo albo Inwokacja: numer grupy → lista bogów. */
function deityGroups(list) {
  const groups = new Map();
  for (const { name, group } of list) {
    if (!group) continue;
    const match = name.match(DEITY_TALENT);
    if (!match) groups.set(group, null);
    else if (groups.get(group) !== null) groups.set(group, [...(groups.get(group) ?? []), match[2]]);
  }
  return new Map([...groups].filter(([, gods]) => gods));
}

/** Czy szablon pyta o bóstwo więcej niż raz. */
export function needsDeityChoice(system) {
  return deityGroups(system.talents.list).size > 1;
}

/** Bogowie do wyboru: tylko ci, którzy są w każdej z grup (np. bogowie z Inwokacją dla kapłana wojownika). */
export function deityOptions(system) {
  const lists = [...deityGroups(system.talents.list).values()];
  if (!lists.length) return [];
  return lists[0].filter((god) => lists.every((gods) => gods.includes(god)));
}

/** Dane szablonu z ustalonym bóstwem: każda grupa Błogosławieństwa i Inwokacji staje się jednym talentem. */
export function withDeity(system, god) {
  const groups = deityGroups(system.talents.list);
  const done = new Set();
  const list = [];
  for (const entry of system.talents.list) {
    if (!groups.has(entry.group)) {
      list.push(entry);
      continue;
    }
    if (done.has(entry.group)) continue;
    done.add(entry.group);
    const kind = entry.name.match(DEITY_TALENT)[1];
    list.push({ ...entry, name: `${kind} (${god})`, group: null });
  }
  return { ...system, talents: { ...system.talents, list } };
}

/**
 * Skrypt talentu Błogosławieństwo z podręcznika głównego. Na postaci gracza pyta o bóstwo („Enter a Deity”),
 * dodaje jego błogosławieństwa i dopisuje boga do nazwy talentu. Przy talencie z szablonu bóstwo jest już znane,
 * więc moduł usuwa ten efekt i robi to samo bez pytania.
 */
export const BLESS_SCRIPT = "Script.IupskvzvoGyD2H5o";

/** Efekty talentu bez efektu, który uruchamia skrypt Błogosławieństwa. */
export function withoutBlessScript(effects = []) {
  return effects.filter((effect) => !JSON.stringify(effect).includes(BLESS_SCRIPT));
}

/** Bóstwo zapisane w nawiasie nazwy talentu, np. "Bless (Ulric)" → "Ulric". */
export function deityInName(name) {
  return name.match(/\(([^()]+)\)\s*$/)?.[1]?.trim() ?? null;
}

/**
 * Błogosławieństwa danego boga spośród modlitw z kompendiów (indeks z polami system.type i system.god).
 * @param {{name: string, uuid: string, system?: {type?: {value: string}, god?: {value: string}}}[]} prayers
 * @param {string[]} godNames – nazwy boga (np. angielska i przetłumaczona)
 */
export function blessingsFor(prayers, godNames) {
  const wanted = new Set(godNames.filter(Boolean).map((name) => name.toLowerCase()));
  return prayers.filter((prayer) => prayer.system?.type?.value === "blessing"
    && String(prayer.system?.god?.value ?? "").split(",").some((god) => wanted.has(god.trim().toLowerCase())));
}
