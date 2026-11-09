/**
 * Ulepszenia potworów, pogrupowane tematycznie. Działają też na ludziach i łączą się ze sobą.
 *
 * tr – cechy stworzeń: "Nazwa" albo ["Nazwa", wartość], np. ["Fear", 2], ["Hatred", "Humans"],
 *      ["Breath", 8, { breath: "fire" }], ["Corruption", "minor"].
 * Cechy Big, Brute, Elite, Fast, Tough, Clever, Cunning i Leader same zmieniają wartości, więc nie powtarzam tego w c.
 */
export const MONSTER_GROUPS = [
  {
    id: "prowess", en: "Prowess", pl: "Tężyzna", icon: "icons/svg/up.svg",
    items: [
      { id: "mighty", en: "Mighty", pl: "Silny", d: ["Every blow lands like a falling beam.", "Każdy cios spada jak walący się strop."], c: { s: 15 }, s: {}, t: ["Strike Mighty Blow"], tr: [] },
      { id: "hulking", en: "Hulking", pl: "Olbrzymi", d: ["Far larger than anything of its kind should be.", "O wiele większy, niż powinien być ktokolwiek z jego gatunku."], c: {}, s: {}, t: [], tr: ["Big"] },
      { id: "brutish", en: "Brutish", pl: "Brutalny", d: ["Slow, heavy and very difficult to argue with.", "Powolny, ciężki i bardzo trudno się z nim spierać."], c: {}, s: {}, t: [], tr: ["Brute"] },
      { id: "swift", en: "Swift", pl: "Szybki", d: ["Crosses the room before the shout has ended.", "Przebiega komnatę, zanim krzyk zdąży ucichnąć."], c: {}, s: {}, t: [], tr: ["Fast"] },
      { id: "hardened", en: "Hardened", pl: "Zahartowany", d: ["Has shrugged off worse than you, and recently.", "Otrząsał się już po gorszych od ciebie, i to niedawno."], c: {}, s: {}, t: ["Tireless"], tr: ["Tough", "Hardy"] },
      { id: "elite-specimen", en: "Elite Specimen", pl: "Elitarny", d: ["The very best its brood or warband has produced.", "Najlepsze, co wydał jego miot albo banda."], c: {}, s: { Dodge: 10, Cool: 10 }, t: [], tr: ["Elite"] },
      { id: "champion", en: "Champion", pl: "Czempion", d: ["Fights for the honour of its kind, and has not lost.", "Walczy za honor swojego rodzaju i jeszcze nie przegrał."], c: { ws: 10, wp: 10 }, s: { "Melee (Basic)": 15, Intimidate: 10 }, t: ["Combat Reflexes"], tr: ["Champion"] },
      { id: "alpha", en: "Alpha", pl: "Przewodnik stada", d: ["The others watch it first and follow it always.", "Pozostali najpierw patrzą na niego, a potem zawsze za nim idą."], c: { ws: 5 }, s: { Leadership: 20, Intimidate: 15 }, t: ["War Leader"], tr: ["Leader", ["Fear", 1]] },
      { id: "dim-witted", en: "Dim-Witted", pl: "Głupi", d: ["Sometimes forgets the fight. Occasionally forgets its own feet.", "Czasem zapomina o walce. Bywa, że zapomina o własnych nogach."], c: { s: 5, i: -10, int: -15, wp: -10 }, s: {}, t: [], tr: ["Stupid"] },
      { id: "sly", en: "Sly", pl: "Przebiegły", d: ["It set this ambush for you, specifically.", "Tę zasadzkę przygotował specjalnie dla ciebie."], c: {}, s: { Perception: 15, Dodge: 5 }, t: [], tr: ["Cunning"] },
      { id: "cowed", en: "Runt", pl: "Chuchro", d: ["The weakest of the pack, and it knows it.", "Najsłabszy w stadzie i dobrze o tym wie."], c: { ws: -10, s: -10, t: -10 }, s: {}, t: [], tr: ["Skittish"] },
      { id: "ancient", en: "Ancient", pl: "Prastary", d: ["Older than the nearest town and much harder to burn down.", "Starszy niż najbliższe miasto i dużo trudniej go spalić."], c: { ws: 15, t: 15, wp: 15, ag: -5 }, s: { Cool: 20, Perception: 15 }, t: ["Iron Will"], tr: ["Hardy", "Die Hard", ["Fear", 2]] }
    ]
  },
  {
    id: "wild", en: "Wild Nature", pl: "Dzika natura", icon: "icons/svg/oak.svg",
    items: [
      { id: "venomous", en: "Venomous", pl: "Jadowity", d: ["A scratch is enough, and a scratch is all it needs.", "Wystarczy zadrapanie, a o zadrapanie mu chodzi."], c: {}, s: {}, t: [], tr: [["Venom", 1]] },
      { id: "rabid", en: "Rabid", pl: "Wściekły", d: ["Foam on the jaws and no interest whatsoever in stopping.", "Piana na pysku i zero chęci, by przestać."], c: { s: 5, wp: 5, int: -10 }, s: {}, t: [], tr: ["Frenzy", "Infected"] },
      { id: "thick-hided", en: "Thick-Hided", pl: "Gruboskóry", d: ["Arrows lodge in its hide and do little else.", "Strzały wbijają się w skórę i niewiele więcej."], c: {}, s: {}, t: [], tr: [["Armour", 2]] },
      { id: "iron-hided", en: "Iron-Hided", pl: "Żelaznoskóry", d: ["Plates of bone and scale that turn good steel aside.", "Płyty z kości i łusek, które odbijają dobrą stal."], c: { ag: -5 }, s: {}, t: [], tr: [["Armour", 4]] },
      { id: "horned", en: "Horned", pl: "Rogaty", d: ["Lowers its head, and that is the only warning you get.", "Opuszcza łeb i to jedyne ostrzeżenie, jakie dostaniesz."], c: {}, s: {}, t: [], tr: [["Horns (Feature)", 3]] },
      { id: "lashing-tail", en: "Lashing Tail", pl: "Biczujący ogon", d: ["Whatever stands behind it is not as safe as it hoped.", "Ten, kto stoi za nim, wcale nie jest tak bezpieczny, jak myślał."], c: {}, s: {}, t: ["Tail Fighting"], tr: [["Tail Attack", 3]] },
      { id: "winged", en: "Winged", pl: "Skrzydlaty", d: ["The shadow passes overhead a moment before the claws.", "Cień przelatuje nad głową chwilę przed szponami."], c: { ag: 5 }, s: {}, t: [], tr: [["Flight", 8]] },
      { id: "wall-crawler", en: "Wall-Crawler", pl: "Pełzacz po ścianach", d: ["Check the ceiling. Then check it again.", "Sprawdź sufit. Potem sprawdź go jeszcze raz."], c: { ag: 5 }, s: { Climb: 20 }, t: [], tr: ["Wallcrawler"] },
      { id: "lurker", en: "Lurker", pl: "Czyhający", d: ["Waits without moving for as long as it takes.", "Czeka bez ruchu tak długo, jak trzeba."], c: { i: 10 }, s: { "Stealth (Rural)": 20, Perception: 10 }, t: [], tr: ["Stealthy", "Night Vision"] },
      { id: "marsh-dweller", en: "Marsh-Dweller", pl: "Bagienny", d: ["The mud slows you down. It only makes this one comfortable.", "Błoto spowalnia ciebie. Jemu tylko dodaje wygody."], c: { t: 5 }, s: { Swim: 20 }, t: [], tr: ["Swamp-strider", "Amphibious"] },
      { id: "man-eater", en: "Man-Eater", pl: "Ludojad", d: ["Has developed a taste, and returns to the same road.", "Nabrał smaku i wraca na tę samą drogę."], c: { s: 5, ws: 5 }, s: { Track: 15 }, t: [], tr: ["Hungry", "Tracker", ["Hatred", "Humans"]] },
      { id: "territorial", en: "Territorial", pl: "Terytorialny", d: ["You crossed a line you could not see.", "Przekroczyłeś granicę, której nie widziałeś."], c: { ws: 5, wp: 5 }, s: {}, t: [], tr: ["Territorial", "Belligerent"] }
    ]
  },
  {
    id: "chaos", en: "Touch of Chaos", pl: "Dotyk Chaosu", icon: "icons/svg/radiation.svg",
    items: [
      { id: "chaos-marked", en: "Chaos-Marked", pl: "Naznaczony przez Chaos", d: ["Something beyond the veil has noticed this creature and made a small correction.", "Coś zza zasłony zauważyło to stworzenie i wprowadziło drobną poprawkę."], c: { s: 5, t: 5, wp: 5 }, s: {}, t: [], tr: [["Corruption", "minor"], "Mutation"] },
      { id: "mark-of-blood", en: "Mark of the Blood God", pl: "Znamię Boga Krwi", d: ["It will not stop while anyone is still standing, including itself.", "Nie zatrzyma się, póki ktokolwiek stoi, wliczając jego samego."], c: { ws: 15, s: 10, wp: 10 }, s: { Intimidate: 20 }, t: ["Strike Mighty Blow", "Furious Assault", "Whirlwind of Death", "Glorious Demise"], tr: ["Frenzy", ["Fear", 2], ["Corruption", "moderate"]] },
      { id: "mark-of-decay", en: "Mark of Decay", pl: "Znamię Rozkładu", d: ["Bloated, patient and impossible to kill properly.", "Rozdęty, cierpliwy i niemożliwy do porządnego zabicia."], c: { t: 20, ag: -10 }, s: { Endurance: 20 }, t: [], tr: ["Hardy", "Regenerate", "Infected", ["Corruption", "moderate"]] },
      { id: "mark-of-excess", en: "Mark of Excess", pl: "Znamię Rozkoszy", d: ["Beautiful and revolting by turns, and very hard to look away from.", "Na przemian piękny i odrażający, a oderwać od niego wzrok bardzo trudno."], c: { i: 15, ag: 15, fel: 15 }, s: { Charm: 20, Dodge: 15 }, t: [], tr: ["Distracting", "Fast", ["Corruption", "moderate"]] },
      { id: "mark-of-change", en: "Mark of Change", pl: "Znamię Przemiany", d: ["Its shape is more of a suggestion, and the air around it hums.", "Jego kształt to raczej propozycja, a powietrze wokół wibruje."], c: { i: 10, int: 15, wp: 15 }, s: { Intuition: 15 }, t: ["Tzeentch's Blessing"], tr: ["Magical", ["Ward", 9], "Mutation", ["Corruption", "moderate"]] },
      { id: "warpstone-gorged", en: "Warpstone-Gorged", pl: "Obżarty spaczeniem", d: ["It glows faintly. It should not have survived the meal.", "Lekko świeci. Nie powinien był przeżyć tego posiłku."], c: { s: 10, t: 10, int: -10 }, s: {}, t: [], tr: ["Mental Corruption", "Mutation", ["Corruption", "major"]] },
      { id: "spawn-flesh", en: "Spawn-Flesh", pl: "Ciało pomiotu", d: ["Wounds close, then open somewhere else, with teeth.", "Rany się zamykają, a potem otwierają gdzie indziej, z zębami."], c: { t: 10, int: -15, fel: -20 }, s: {}, t: [], tr: ["Regenerate", "Painless", "Mutation"] },
      { id: "daemon-possessed", en: "Daemon-Possessed", pl: "Opętany przez demona", d: ["The eyes belong to someone else, and they find you funny.", "Oczy należą do kogoś innego i uważają cię za zabawnego."], c: { ws: 10, s: 5, wp: 20 }, s: {}, t: [], tr: [["Daemonic", 8], ["Fear", 3], "Magical", ["Corruption", "major"]] }
    ]
  },
  {
    id: "undeath", en: "Undeath", pl: "Nieumarli", icon: "icons/svg/bones.svg",
    items: [
      { id: "risen", en: "Risen", pl: "Ożywiony", d: ["It was buried once. It disagreed.", "Raz już go pochowano. Nie zgodził się z tym."], c: { t: 5, i: -15, ag: -10, int: -20, fel: -30 }, s: {}, t: [], tr: ["Undead", "Painless", "Immunity to Psychology", "Unstable", ["Fear", 1]] },
      { id: "grave-chill", en: "Grave-Chill", pl: "Grobowy chłód", d: ["Its touch leaves frost on the skin and a silence in the chest.", "Jego dotyk zostawia szron na skórze i ciszę w piersi."], c: { wp: 10 }, s: {}, t: [], tr: ["Chill Grasp", ["Fear", 1]] },
      { id: "blood-drinker", en: "Blood-Drinker", pl: "Krwiopijca", d: ["Every wound it opens makes it a little stronger.", "Każda zadana rana czyni go odrobinę silniejszym."], c: { ws: 5, s: 5 }, s: {}, t: [], tr: ["Vampiric", "Night Vision"] },
      { id: "spectral", en: "Spectral", pl: "Widmowy", d: ["Blades pass through. Its hands, unfortunately, do not.", "Ostrza przez niego przechodzą. Jego dłonie niestety nie."], c: { ag: 10, wp: 15, s: -5 }, s: {}, t: [], tr: ["Ethereal", "Magical", ["Fear", 2]] },
      { id: "wight-lord", en: "Barrow Lord", pl: "Pan Kurhanu", d: ["Still commands the armies buried around it.", "Wciąż dowodzi armiami pogrzebanymi wokół siebie."], c: { ws: 20, s: 10, t: 15, wp: 20 }, s: { Leadership: 25, "Melee (Basic)": 20 }, t: ["War Leader", "Strike Mighty Blow"], tr: ["Undead", "Painless", "Immunity to Psychology", ["Terror", 2], ["Armour", 2]] },
      { id: "deathless", en: "Deathless", pl: "Niezniszczalny truposz", d: ["Put it down and it will be back by nightfall, angrier.", "Powal go, a o zmroku wróci, jeszcze bardziej wściekły."], c: { t: 20, wp: 20 }, s: {}, t: [], tr: ["Undead", "Regenerate", "Die Hard", ["Ward", 8], ["Terror", 1]] }
    ]
  },
  {
    id: "arcane", en: "Arcane Gifts", pl: "Dary magii", icon: "icons/svg/portal.svg",
    items: [
      { id: "fire-breather", en: "Fire-Breather", pl: "Ziejący ogniem", d: ["A deep breath in is the signal to run.", "Głęboki wdech to znak, że trzeba uciekać."], c: {}, s: {}, t: [], tr: [["Breath", 8, { breath: "fire" }]] },
      { id: "frost-breather", en: "Frost-Breather", pl: "Ziejący mrozem", d: ["Leaves statues of whatever was standing in front of it.", "Zostawia posągi z tego, co przed nim stało."], c: {}, s: {}, t: [], tr: [["Breath", 8, { breath: "cold" }]] },
      { id: "plague-breather", en: "Poison-Breather", pl: "Ziejący trucizną", d: ["A green fog rolls forward, and the birds stop singing.", "Zielona mgła toczy się naprzód, a ptaki milkną."], c: {}, s: {}, t: [], tr: [["Breath", 6, { breath: "poison" }]] },
      { id: "storm-breather", en: "Storm-Breather", pl: "Ziejący burzą", d: ["The air tastes of copper a second before it arrives.", "Powietrze smakuje miedzią na sekundę przed uderzeniem."], c: {}, s: {}, t: [], tr: [["Breath", 8, { breath: "electricity" }]] },
      { id: "aethyric-ward", en: "Aethyric Ward", pl: "Eteryczna osłona", d: ["Blows glance off nothing at all, shimmering as they go.", "Ciosy odbijają się od niczego, migocząc po drodze."], c: { wp: 10 }, s: {}, t: [], tr: [["Ward", 9], "Magical"] },
      { id: "spell-eater", en: "Spell-Eater", pl: "Pożeracz czarów", d: ["Spells unravel in its presence and leave the caster with a nosebleed.", "Czary rozpadają się przy nim, a magowi leci krew z nosa."], c: { wp: 15 }, s: {}, t: ["Magic Resistance", "Magic Defiance"], tr: ["Magic Resistance"] },
      { id: "petrifying", en: "Stone-Gazer", pl: "Spojrzenie Kamienia", d: ["The garden was full of very lifelike statues.", "Ogród był pełen bardzo realistycznych posągów."], c: { wp: 10 }, s: {}, t: [], tr: ["Petrifying Gaze", ["Fear", 1]] },
      { id: "sorcerous", en: "Sorcerous", pl: "Czarnoksięski", d: ["Whispers in a language that hurts, and the air obeys.", "Szepcze w języku, który boli, a powietrze słucha."], c: { int: 15, wp: 15 }, s: { "Language (Magick)": 15 }, sc: [{ adv: 20, of: ["Aqshy", "Azyr", "Chamon", "Ghur", "Ghyran", "Hysh", "Shyish", "Ulgu"].map((wind) => `Channelling (${wind})`) }], t: ["Petty Magic", "Instinctive Diction"], l: { petty: 3, any: 5 }, tr: ["Magical"], tc: [["Arcane Magic (Fire)", "Arcane Magic (Heavens)", "Arcane Magic (Beasts)", "Arcane Magic (Metal)", "Arcane Magic (Life)", "Arcane Magic (Light)", "Arcane Magic (Shadow)", "Arcane Magic (Death)"]] }
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
      { id: "warlord", en: "Warlord", pl: "Wódz wojenny", d: ["An army's worth of bad ideas, all of them working.", "Cała armia złych pomysłów, a wszystkie działają."], c: { ws: 20, s: 10, t: 10, wp: 20 }, s: { Leadership: 40, "Melee (Basic)": 25, Intimidate: 25 }, t: ["War Leader", "Inspiring", "Combat Master", "Strike Mighty Blow"], tr: ["Leader", "Champion", "Elite", ["Fear", 3]] },
      { id: "legendary", en: "Legendary", pl: "Legendarny", d: ["Bards disagree about the details. Survivors do not disagree about anything.", "Bardowie spierają się o szczegóły. Ocaleni nie spierają się o nic."], c: { ws: 20, s: 15, t: 20, i: 15, wp: 20 }, s: { Cool: 30, Dodge: 25, Perception: 20 }, t: ["Combat Master", "Combat Reflexes", "Strike Mighty Blow", "Strike Mighty Blow", "Strike to Injure", "Whirlwind of Death"], tr: ["Champion", "Hardy", "Die Hard", "Immunity to Psychology", ["Ward", 8], ["Terror", 2]] },
      { id: "doom-incarnate", en: "Doom Incarnate", pl: "Wcielona zagłada", d: ["For the table that has stopped being afraid. It ends campaigns.", "Dla stołu, który przestał się bać. Kończy kampanie."], c: { ws: 30, bs: 15, s: 25, t: 30, i: 20, ag: 10, wp: 30 }, s: { Cool: 40, Dodge: 30, Perception: 30, Intimidate: 40 }, t: ["Combat Master", "Combat Reflexes", "Reaction Strike", "Strike Mighty Blow", "Strike Mighty Blow", "Strike Mighty Blow", "Strike to Injure", "Iron Will", "Whirlwind of Death", "Glorious Demise"], tr: ["Champion", "Elite", "Big", "Hardy", "Regenerate", "Die Hard", "Magical", "Immunity to Psychology", ["Ward", 6], ["Armour", 5], ["Terror", 4]] }
    ]
  }
];
