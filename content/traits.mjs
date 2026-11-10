/**
 * Cechy: co przeciwnik ma w sobie szczególnego. Działają na każdej rasie i łączą się ze sobą.
 * Pola: d (opis EN/PL), c (cechy), s (umiejętności), t (talenty), tr (cechy stworzeń: "Nazwa" albo ["Nazwa", wartość]),
 * sc i tc (wybór umiejętności i talentu), l (zaklęcia do wyboru), sp (stałe zaklęcia z podręcznika), gear (wyposażenie).
 * Cechy stworzeń Big, Brute, Elite, Fast, Tough, Cunning i Leader same zmieniają wartości, więc nie powtarzam tego w c.
 */
export const TRAIT_GROUPS = [
  {
    id: "body", en: "Body", pl: "Ciało", icon: "icons/svg/oak.svg",
    items: [
      { id: "mighty", en: "Mighty", pl: "Silny", d: ["Every blow lands like a falling beam.", "Każdy cios spada jak walący się strop."], c: { s: 15 }, s: {}, t: ["Strike Mighty Blow"], tr: [] },
      { id: "hulking", en: "Hulking", pl: "Olbrzymi", d: ["Far larger than anything of its kind should be.", "O wiele większy, niż powinien być ktokolwiek z jego gatunku."], c: {}, s: {}, t: [], tr: ["Big"] },
      { id: "brutish", en: "Brutish", pl: "Brutalny", d: ["Slow, heavy and very difficult to argue with.", "Powolny, ciężki i bardzo trudno się z nim spierać."], c: {}, s: {}, t: [], tr: ["Brute"] },
      { id: "swift", en: "Swift", pl: "Szybki", d: ["Crosses the room before the shout has ended.", "Przebiega komnatę, zanim krzyk zdąży ucichnąć."], c: {}, s: {}, t: [], tr: ["Fast"] },
      { id: "hardened", en: "Hardened", pl: "Zahartowany", d: ["Has shrugged off worse than you, and recently.", "Otrząsał się już po gorszych od ciebie, i to niedawno."], c: {}, s: {}, t: ["Tireless"], tr: ["Tough", "Hardy"] },
      { id: "ancient", en: "Ancient", pl: "Prastary", d: ["Older than the nearest town and much harder to burn down.", "Starszy niż najbliższe miasto i dużo trudniej go spalić."], c: { ws: 15, t: 15, wp: 15, ag: -5 }, s: { Cool: 20, Perception: 15 }, t: ["Iron Will"], tr: ["Hardy", "Die Hard", ["Fear", 2]] },
      { id: "venomous", en: "Venomous", pl: "Jadowity", d: ["A scratch is enough, and a scratch is all it needs.", "Wystarczy zadrapanie, a o zadrapanie mu chodzi."], c: {}, s: {}, t: [], tr: [["Venom", 1]] },
      { id: "thick-hided", en: "Thick-Hided", pl: "Gruboskóry", d: ["Arrows lodge in its hide and do little else.", "Strzały wbijają się w skórę i niewiele więcej."], c: {}, s: {}, t: [], tr: [["Armour", 2]] },
      { id: "iron-hided", en: "Iron-Hided", pl: "Żelaznoskóry", d: ["Plates of bone and scale that turn good steel aside.", "Płyty z kości i łusek, które odbijają dobrą stal."], c: { ag: -5 }, s: {}, t: [], tr: [["Armour", 4]] },
      { id: "horned", en: "Horned", pl: "Rogaty", d: ["Lowers its head, and that is the only warning you get.", "Opuszcza łeb i to jedyne ostrzeżenie, jakie dostaniesz."], c: {}, s: {}, t: [], tr: [["Horns (Feature)", 3]] },
      { id: "lashing-tail", en: "Lashing Tail", pl: "Biczujący ogon", d: ["Whatever stands behind it is not as safe as it hoped.", "Ten, kto stoi za nim, wcale nie jest tak bezpieczny, jak myślał."], c: {}, s: {}, t: ["Tail Fighting"], tr: [["Tail Attack", 3]] },
      { id: "winged", en: "Winged", pl: "Skrzydlaty", d: ["The shadow passes overhead a moment before the claws.", "Cień przelatuje nad głową chwilę przed szponami."], c: { ag: 5 }, s: {}, t: [], tr: [["Flight", 8]] },
      { id: "wall-crawler", en: "Wall-Crawler", pl: "Pełzacz po ścianach", d: ["Check the ceiling. Then check it again.", "Sprawdź sufit. Potem sprawdź go jeszcze raz."], c: { ag: 5 }, s: { Climb: 20 }, t: [], tr: ["Wallcrawler"] }
    ]
  },
  {
    id: "nature", en: "Nature", pl: "Natura", icon: "icons/svg/eye.svg",
    items: [
      { id: "sly", en: "Sly", pl: "Przebiegły", d: ["It set this ambush for you, specifically.", "Tę zasadzkę przygotował specjalnie dla ciebie."], c: {}, s: { Perception: 15, Dodge: 5 }, t: [], tr: ["Cunning"] },
      { id: "cunning", en: "Cunning", pl: "Spryciarz", d: ["Always has a second way out and someone else to blame.", "Zawsze ma drugie wyjście i kogoś innego do obwinienia."], c: { s: -5, i: 10, int: 10, fel: 5 }, s: { Intuition: 15, Perception: 10, Gossip: 10 }, t: ["Schemer", "Flee!"] },
      { id: "fanatic", en: "Fanatic", pl: "Fanatyk", d: ["Believes, completely, in something you will regret asking about.", "Wierzy bez reszty w coś, o co pożałujesz, że zapytałeś."], c: { ws: 5, int: -5, wp: 15, fel: -10 }, s: { Cool: 15, Intimidate: 10 }, t: ["Frenzy", "Implacable"] },
      { id: "rabid", en: "Rabid", pl: "Wściekły", d: ["Foam on the jaws and no interest whatsoever in stopping.", "Piana na pysku i zero chęci, by przestać."], c: { s: 5, wp: 5, int: -10 }, s: {}, t: [], tr: ["Frenzy", "Infected"] },
      { id: "lurker", en: "Lurker", pl: "Czyhający", d: ["Waits without moving for as long as it takes.", "Czeka bez ruchu tak długo, jak trzeba."], c: { i: 10 }, s: { "Stealth (Rural)": 20, Perception: 10 }, t: [], tr: ["Stealthy", "Night Vision"] },
      { id: "marsh-dweller", en: "Marsh-Dweller", pl: "Bagienny", d: ["The mud slows you down. It only makes this one comfortable.", "Błoto spowalnia ciebie. Jemu tylko dodaje wygody."], c: { t: 5 }, s: { Swim: 20 }, t: [], tr: ["Swamp-strider", "Amphibious"] },
      { id: "man-eater", en: "Man-Eater", pl: "Ludojad", d: ["Has developed a taste, and returns to the same road.", "Nabrał smaku i wraca na tę samą drogę."], c: { s: 5, ws: 5 }, s: { Track: 15 }, t: [], tr: ["Hungry", "Tracker", ["Hatred", "Humans"]] },
      { id: "territorial", en: "Territorial", pl: "Terytorialny", d: ["You crossed a line you could not see.", "Przekroczyłeś granicę, której nie widziałeś."], c: { ws: 5, wp: 5 }, s: {}, t: [], tr: ["Territorial", "Belligerent"] }
    ]
  },
  {
    id: "powers", en: "Powers", pl: "Moce", icon: "icons/svg/portal.svg",
    items: [
      { id: "fire-breather", en: "Fire-Breather", pl: "Ziejący ogniem", d: ["A deep breath in is the signal to run.", "Głęboki wdech to znak, że trzeba uciekać."], c: {}, s: {}, t: [], tr: [["Breath", 8, { breath: "fire" }]] },
      { id: "frost-breather", en: "Frost-Breather", pl: "Ziejący mrozem", d: ["Leaves statues of whatever was standing in front of it.", "Zostawia posągi z tego, co przed nim stało."], c: {}, s: {}, t: [], tr: [["Breath", 8, { breath: "cold" }]] },
      { id: "plague-breather", en: "Poison-Breather", pl: "Ziejący trucizną", d: ["A green fog rolls forward, and the birds stop singing.", "Zielona mgła toczy się naprzód, a ptaki milkną."], c: {}, s: {}, t: [], tr: [["Breath", 6, { breath: "poison" }]] },
      { id: "storm-breather", en: "Storm-Breather", pl: "Ziejący burzą", d: ["The air tastes of copper a second before it arrives.", "Powietrze smakuje miedzią na sekundę przed uderzeniem."], c: {}, s: {}, t: [], tr: [["Breath", 8, { breath: "electricity" }]] },
      { id: "aethyric-ward", en: "Aethyric Ward", pl: "Eteryczna osłona", d: ["Blows glance off nothing at all, shimmering as they go.", "Ciosy odbijają się od niczego, migocząc po drodze."], c: { wp: 10 }, s: {}, t: [], tr: [["Ward", 9], "Magical"] },
      { id: "spell-eater", en: "Spell-Eater", pl: "Pożeracz czarów", d: ["Spells unravel in its presence and leave the caster with a nosebleed.", "Czary rozpadają się przy nim, a magowi leci krew z nosa."], c: { wp: 15 }, s: {}, t: ["Magic Resistance", "Magic Defiance"], tr: ["Magic Resistance"] },
      { id: "petrifying", en: "Stone-Gazer", pl: "Spojrzenie Kamienia", d: ["The garden was full of very lifelike statues.", "Ogród był pełen bardzo realistycznych posągów."], c: { wp: 10 }, s: {}, t: [], tr: ["Petrifying Gaze", ["Fear", 1]] }
    ]
  },
  {
    id: "taint", en: "Taint", pl: "Skażenie", icon: "icons/svg/radiation.svg",
    items: [
      { id: "chaos-marked", en: "Chaos-Marked", pl: "Naznaczony przez Chaos", d: ["Something beyond the veil has noticed this creature and made a small correction.", "Coś zza zasłony zauważyło to stworzenie i wprowadziło drobną poprawkę."], c: { s: 5, t: 5, wp: 5 }, s: {}, t: [], tr: [["Corruption", "minor"], "Mutation"] },
      { id: "mark-of-blood", en: "Mark of the Blood God", pl: "Znamię Boga Krwi", d: ["It will not stop while anyone is still standing, including itself.", "Nie zatrzyma się, póki ktokolwiek stoi, wliczając jego samego."], c: { ws: 15, s: 10, wp: 10 }, s: { Intimidate: 20 }, t: ["Strike Mighty Blow", "Furious Assault", "Whirlwind of Death", "Glorious Demise"], tr: ["Frenzy", ["Fear", 2], ["Corruption", "moderate"]] },
      { id: "mark-of-decay", en: "Mark of Decay", pl: "Znamię Rozkładu", d: ["Bloated, patient and impossible to kill properly.", "Rozdęty, cierpliwy i niemożliwy do porządnego zabicia."], c: { t: 20, ag: -10 }, s: { Endurance: 20 }, t: [], tr: ["Hardy", "Regenerate", "Infected", ["Corruption", "moderate"]] },
      { id: "mark-of-excess", en: "Mark of Excess", pl: "Znamię Rozkoszy", d: ["Beautiful and revolting by turns, and very hard to look away from.", "Na przemian piękny i odrażający, a oderwać od niego wzrok bardzo trudno."], c: { i: 15, ag: 15, fel: 15 }, s: { Charm: 20, Dodge: 15 }, t: [], tr: ["Distracting", "Fast", ["Corruption", "moderate"]] },
      { id: "mark-of-change", en: "Mark of Change", pl: "Znamię Przemiany", d: ["Its shape is more of a suggestion, and the air around it hums.", "Jego kształt to raczej propozycja, a powietrze wokół wibruje."], c: { i: 10, int: 15, wp: 15 }, s: { Intuition: 15 }, t: ["Tzeentch's Blessing"], tr: ["Magical", ["Ward", 9], "Mutation", ["Corruption", "moderate"]] },
      { id: "warpstone-gorged", en: "Warpstone-Gorged", pl: "Obżarty spaczeniem", d: ["It glows faintly. It should not have survived the meal.", "Lekko świeci. Nie powinien był przeżyć tego posiłku."], c: { s: 10, t: 10, int: -10 }, s: {}, t: [], tr: ["Mental Corruption", "Mutation", ["Corruption", "major"]] },
      { id: "spawn-flesh", en: "Spawn-Flesh", pl: "Ciało pomiotu", d: ["Wounds close, then open somewhere else, with teeth.", "Rany się zamykają, a potem otwierają gdzie indziej, z zębami."], c: { t: 10, int: -15, fel: -20 }, s: {}, t: [], tr: ["Regenerate", "Painless", "Mutation"] },
      { id: "daemon-possessed", en: "Daemon-Possessed", pl: "Opętany przez demona", d: ["The eyes belong to someone else, and they find you funny.", "Oczy należą do kogoś innego i uważają cię za zabawnego."], c: { ws: 10, s: 5, wp: 20 }, s: {}, t: [], tr: [["Daemonic", 8], ["Fear", 3], "Magical", ["Corruption", "major"]] },
      { id: "tainted", en: "Tainted", pl: "Spaczony", d: ["Something is subtly wrong with this one. Horses refuse to go near.", "Coś jest z nim nie tak, choć trudno powiedzieć co. Konie nie chcą podejść."], c: { t: 10, wp: -5, fel: -15 }, s: { Intimidate: 15, Cool: 5 }, t: ["Frightening", "Doomed"] },
      { id: "blood-sworn", en: "Blood-Sworn", pl: "Zaprzysiężony krwi", d: ["Keeps a tally of skulls and a very short temper.", "Prowadzi rachunek czaszek i ma bardzo krótki lont."], c: { ws: 10, s: 5, int: -5, fel: -10 }, s: { "Melee (Basic)": 15, Intimidate: 15 }, t: ["Frenzy", "Strike Mighty Blow"] },
      { id: "plague-touched", en: "Plague-Blessed", pl: "Pobłogosławiony zarazą", d: ["Boils cheerfully and finds your concern quite touching.", "Radośnie ropieje i uważa twoją troskę za wzruszającą."], c: { t: 15, ag: -10, fel: -10 }, s: { Endurance: 20, Cool: 10 }, t: ["Resistance (Disease)", "Hardy"] },
      { id: "libertine", en: "Depraved Libertine", pl: "Zepsuty rozpustnik", d: ["Has tried everything once and is looking for something new. You will do.", "Próbował wszystkiego raz i szuka czegoś nowego. Nadasz się."], c: { ag: 5, fel: 15, wp: -5 }, s: { Charm: 20, "Consume Alcohol": 15, Gossip: 5 }, t: ["Attractive", "Carouser", "Vice (Pleasure)"] },
      { id: "schemer", en: "Web-Weaver", pl: "Tkacz intryg", d: ["Every plan is a smaller part of a plan you have not yet noticed.", "Każdy plan to tylko część planu, którego jeszcze nie zauważyłeś."], c: { i: 5, int: 15, wp: 5, s: -5 }, s: { Intuition: 15, Research: 10, Charm: 10 }, t: ["Schemer", "Read/Write"] },
      { id: "thrall", en: "Vampire's Thrall", pl: "Sługa wampira", d: ["Devoted, pale and on watch through the hours of daylight.", "Oddany, blady i czuwający przez cały dzień."], c: { s: 5, wp: -10 }, s: { Cool: 10, "Stealth (Urban)": 15, Perception: 5 }, t: ["Strong-minded", "Night Vision"] },
      { id: "skaven-informant", en: "Ratman's Informant", pl: "Donosiciel szczuroludzi", d: ["Takes payment in odd green coins and avoids the sewer grates.", "Bierze zapłatę w dziwnych zielonych monetach i omija kratki ściekowe."], c: { i: 5, wp: -5 }, s: { Gossip: 10, "Stealth (Underground)": 15, "Language (Queekish)": 5 }, t: ["Tunnel Rat", "Secret Identity"] },
      { id: "hedge-witch", en: "Hedge Witch", pl: "Wiedźma", d: ["Knows the old charms the temples burned people for.", "Zna stare zaklęcia, za które świątynie paliły ludzi na stosach."], c: { int: 5, wp: 10, fel: -5 }, s: { "Outdoor Survival": 10, "Trade (Herbalist)": 15, Heal: 10 }, t: ["Petty Magic", "Witch!"], l: { petty: 3 } },
      { id: "grave-robber", en: "Necromancer's Servant", pl: "Sługa nekromanty", d: ["Digs by moonlight, delivers by cart and asks no questions.", "Kopie przy księżycu, dostarcza wozem i o nic nie pyta."], c: { s: 5, t: 5, wp: -5 }, s: { Endurance: 10, "Stealth (Rural)": 10, Cool: 15 }, t: ["Fearless (Undead)", "Coolheaded"] }
    ]
  },
  {
    id: "undeath", en: "Undeath", pl: "Nieumarłość", icon: "icons/svg/bones.svg",
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
    id: "weakness", en: "Weaknesses", pl: "Słabości", icon: "icons/svg/degen.svg",
    items: [
      { id: "dim-witted", en: "Dim-Witted", pl: "Głupi", d: ["Sometimes forgets the fight. Occasionally forgets its own feet.", "Czasem zapomina o walce. Bywa, że zapomina o własnych nogach."], c: { s: 5, i: -10, int: -15, wp: -10 }, s: {}, t: [], tr: ["Stupid"] },
      { id: "cowed", en: "Runt", pl: "Chuchro", d: ["The weakest of the pack, and it knows it.", "Najsłabszy w stadzie i dobrze o tym wie."], c: { ws: -10, s: -10, t: -10 }, s: {}, t: [], tr: ["Skittish"] },
      { id: "coward", en: "Coward", pl: "Tchórz", d: ["First to run, last to admit it, and surprisingly hard to catch.", "Pierwszy do ucieczki, ostatni, by się przyznać, i zaskakująco trudny do złapania."], c: { ag: 10, wp: -15 }, s: { Dodge: 15, Athletics: 15, Charm: 5 }, t: ["Flee!", "Sprinter"] },
      { id: "drunkard", en: "Drunkard", pl: "Pijak", d: ["Fully operational only after the fourth pint. Mostly.", "W pełni sprawny dopiero po czwartym kuflu. Zwykle."], c: { ws: -5, i: -5, ag: -5, dex: -10, t: 5 }, s: { "Consume Alcohol": 25, Gossip: 15, Gamble: 5 }, t: ["Carouser", "Vice (Alcohol)"] },
      { id: "wounded", en: "Wounded", pl: "Ranny", d: ["Bandaged badly, limping worse and short of temper.", "Źle opatrzony, kuleje jeszcze gorzej i łatwo traci cierpliwość."], c: { ws: -5, s: -5, t: -10, ag: -10 }, s: {}, t: [] },
      { id: "plague-ridden", en: "Plague-Ridden", pl: "Zadżumiony", d: ["Coughs into a rag that no one should look at closely.", "Kaszle w szmatę, której nikt nie powinien oglądać z bliska."], c: { s: -10, t: -10, fel: -10 }, s: { Endurance: 10 }, t: [] },
      { id: "one-eyed", en: "One-Eyed", pl: "Jednooki", d: ["Lost the eye years ago and tells a different story about it every night.", "Stracił oko przed laty i co wieczór opowiada o tym inaczej."], c: { bs: -15, i: -5 }, s: { Intimidate: 10, Gossip: 5 }, t: [] },
      { id: "starving", en: "Starving", pl: "Wygłodzony", d: ["All ribs and eyes. Will do remarkable things for bread.", "Same żebra i oczy. Za chleb zrobi rzeczy zadziwiające."], c: { s: -10, t: -10, ag: -5, wp: -5 }, s: {}, t: [] },
      { id: "madman", en: "Unhinged", pl: "Obłąkany", d: ["Holds long conversations with someone standing just behind you.", "Prowadzi długie rozmowy z kimś, kto stoi tuż za tobą."], c: { i: 5, int: -10, wp: 10, fel: -15 }, s: { Intimidate: 10, Perception: 5 }, t: ["Strong-minded"] },
      { id: "hunchback", en: "Hunchback", pl: "Garbus", d: ["Bent by birth or by labour and stronger than the mockers expected.", "Pochylony od urodzenia lub od pracy, silniejszy, niż sądzili szydercy."], c: { s: 5, t: 5, ag: -10, fel: -10 }, s: { Endurance: 10, "Stealth (Urban)": 5 }, t: ["Strong Back"] },
      { id: "exhausted", en: "Exhausted", pl: "Wycieńczony", d: ["Has not slept properly since the last village, or possibly the one before.", "Nie spał porządnie od ostatniej wsi, a może i od przedostatniej."], c: { ws: -10, bs: -10, i: -15, ag: -10 }, s: {}, t: [] },
      { id: "cursed", en: "Cursed", pl: "Przeklęty", d: ["Dogs bark, milk sours, and something is due to collect before winter.", "Psy szczekają, mleko kwaśnieje, a przed zimą coś upomni się o dług."], c: { wp: -5, fel: -10 }, s: { Cool: 5 }, t: ["Doomed"] },
      { id: "scarred", en: "Horribly Scarred", pl: "Straszliwie okaleczony", d: ["The face tells the tale nobody wants to hear twice.", "Twarz opowiada historię, której nikt nie chce usłyszeć drugi raz."], c: { fel: -15, wp: 5 }, s: { Intimidate: 20 }, t: ["Menacing"] }
    ]
  }
];
