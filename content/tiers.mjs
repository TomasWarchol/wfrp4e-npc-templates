/**
 * Poziom zagrożenia: jak groźny jest przeciwnik, niezależnie od rasy i roli.
 * Pola: d (opis EN/PL), c (cechy), s (umiejętności), t (talenty), tr (cechy stworzeń: "Nazwa" albo ["Nazwa", wartość]),
 * sc i tc (wybór umiejętności i talentu), l (zaklęcia do wyboru), sp (stałe zaklęcia z podręcznika), gear (wyposażenie).
 */
export const TIER_GROUPS = [
  {
    id: "tier-strength", en: "Strength", pl: "Siła", icon: "icons/svg/up.svg",
    items: [
      { id: "cannon-fodder", en: "Cannon Fodder", pl: "Mięso armatnie", d: ["There are more where this one came from, and nobody will count them.", "Jest ich więcej tam, skąd przyszedł, i nikt ich nie liczy."], c: { ws: -10, bs: -10, wp: -10 }, s: {}, t: [], tr: [] },
      { id: "grizzled", en: "Grizzled", pl: "Weteran", d: ["Slower than once, but impossible to surprise.", "Wolniejszy niż dawniej, ale nie sposób go zaskoczyć."], c: { ws: 5, ag: -5, wp: 10 }, s: { Cool: 10, Intuition: 10, Perception: 10 }, t: ["Coolheaded", "Nose for Trouble"] },
      { id: "elite", en: "Elite", pl: "Elita", d: ["The best of the unit, and very aware of it.", "Najlepszy w oddziale i doskonale zdaje sobie z tego sprawę."], c: {}, s: { Dodge: 10, Cool: 10 }, t: ["Combat Reflexes", "Strike Mighty Blow"], tr: ["Elite"] },
      { id: "boss", en: "Boss", pl: "Boss", d: ["Everything else in the room was only in the way.", "Wszystko inne w tej komnacie tylko stało na drodze."], c: { ws: 10, wp: 10 }, s: { Cool: 20, Dodge: 15, Intimidate: 15 }, t: ["Combat Reflexes", "Strike Mighty Blow", "Iron Will"], tr: ["Tough", "Die Hard", ["Fear", 1]] },
      { id: "legendary", en: "Legendary", pl: "Legenda", d: ["Bards disagree about the details. Survivors do not disagree about anything.", "Bardowie spierają się o szczegóły. Ocaleni nie spierają się o nic."], c: { ws: 20, s: 15, t: 20, i: 15, wp: 20 }, s: { Cool: 30, Dodge: 25, Perception: 20 }, t: ["Combat Master", "Combat Reflexes", "Strike Mighty Blow", "Strike Mighty Blow", "Strike to Injure", "Whirlwind of Death"], tr: ["Champion", "Hardy", "Die Hard", "Immunity to Psychology", ["Ward", 8], ["Terror", 2]] }
    ]
  },
  {
    id: "bane", en: "Bane of Heroes", pl: "Zguba bohaterów", icon: "icons/svg/terror.svg",
    items: [
      { id: "apex-predator", en: "Apex Predator", pl: "Szczytowy drapieżnik", d: ["Nothing in this region hunts it. Nothing that has lived.", "Nic w tej okolicy na niego nie poluje. Nic, co przeżyło."], c: { ws: 10, s: 5, i: 10 }, s: { Perception: 20, Track: 20, "Stealth (Rural)": 15 }, t: ["Strike Mighty Blow", "Strike to Injure", "Combat Reflexes"], tr: ["Elite", "Fast", "Tracker", ["Fear", 3]] },
      { id: "nemesis", en: "Nemesis", pl: "Nemezis", d: ["It remembers the party, and it has been preparing.", "Pamięta drużynę i przez cały ten czas się przygotowywał."], c: { ws: 15, wp: 15 }, s: { Cool: 25, Dodge: 20, Intuition: 20 }, t: ["Combat Master", "Iron Will", "Reaction Strike"], tr: ["Champion", "Elite", "Tough", "Die Hard", ["Hatred", "Heroes"], ["Terror", 1]] },
      { id: "unkillable", en: "Unkillable", pl: "Nie do zabicia", d: ["They said it died at the bridge. They also said it died last week.", "Mówili, że zginął przy moście. Mówili też, że zginął w zeszłym tygodniu."], c: { t: 25, wp: 15 }, s: { Endurance: 30, Cool: 20 }, t: ["Implacable", "Very Resilient"], tr: ["Hardy", "Regenerate", "Die Hard", ["Ward", 7], ["Armour", 3]] },
      { id: "scourge", en: "Scourge of the Province", pl: "Plaga prowincji", d: ["Villages are abandoned at the rumour of it.", "Na samą plotkę o nim ludzie porzucają wsie."], c: { ws: 15, s: 10, t: 15 }, s: { Intimidate: 30 }, t: ["Strike Mighty Blow", "Menacing", "Strike Mighty Blow"], tr: ["Big", "Brute", "Belligerent", ["Terror", 3]] },
      { id: "spell-breaker", en: "Bane of Wizards", pl: "Zmora magów", d: ["Hunts those who smell of the Winds, and it can smell them now.", "Poluje na tych, od których czuć Wiatry, i właśnie ich zwietrzył."], c: { i: 15, wp: 25 }, s: { Perception: 20, Cool: 20 }, t: ["Magic Resistance", "Magic Resistance", "Iron Will", "Magic Defiance"], tr: ["Magic Resistance", "Immunity to Psychology", ["Ward", 8], ["Hatred", "Wizards"]] },
      { id: "doom-incarnate", en: "Doom Incarnate", pl: "Wcielona zagłada", d: ["For the table that has stopped being afraid. It ends campaigns.", "Dla stołu, który przestał się bać. Kończy kampanie."], c: { ws: 30, bs: 15, s: 25, t: 30, i: 20, ag: 10, wp: 30 }, s: { Cool: 40, Dodge: 30, Perception: 30, Intimidate: 40 }, t: ["Combat Master", "Combat Reflexes", "Reaction Strike", "Strike Mighty Blow", "Strike Mighty Blow", "Strike Mighty Blow", "Strike to Injure", "Iron Will", "Whirlwind of Death", "Glorious Demise"], tr: ["Champion", "Elite", "Big", "Hardy", "Regenerate", "Die Hard", "Magical", "Immunity to Psychology", ["Ward", 6], ["Armour", 5], ["Terror", 4]] }
    ]
  }
];
