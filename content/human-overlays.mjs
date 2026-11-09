/**
 * Nakładki na ludzi, pogrupowane tematycznie. Łączą się z dowolnym szablonem i nie zmieniają imienia.
 * Pola jak w content/templates.mjs: d (opis EN/PL), c (cechy), s (umiejętności), t (talenty).
 */
export const HUMAN_GROUPS = [
  {
    id: "origins", en: "Origins", pl: "Pochodzenie", icon: "icons/svg/village.svg",
    items: [
      { id: "reiklander", en: "Reiklander", pl: "Reiklandczyk", d: ["Raised on the Empire's busiest river and convinced it is the centre of the world.", "Wychowany nad najruchliwszą rzeką Imperium i pewien, że to środek świata."], c: { fel: 5 }, s: { "Language (Reikspiel)": 10, Gossip: 10, Haggle: 5 }, t: [] },
      { id: "middenheimer", en: "Middenheimer", pl: "Middenheimczyk", d: ["Born on the great rock, loyal to the White Wolf and suspicious of southerners.", "Urodzony na wielkiej skale, wierny Białemu Wilkowi i nieufny wobec południowców."], c: { t: 5, wp: 5 }, s: { Cool: 10, Endurance: 5, Intimidate: 5 }, t: ["Stout-hearted"] },
      { id: "stirlander", en: "Stirlander", pl: "Stirlandczyk", d: ["Poor, muddy and very familiar with what walks out of the graveyards.", "Biedny, ubłocony i dobrze wie, co wychodzi z cmentarzy."], c: { wp: 5, fel: -5 }, s: { "Outdoor Survival": 10, "Stealth (Rural)": 10, Cool: 5 }, t: ["Rover"] },
      { id: "nordlander", en: "Nordlander", pl: "Nordlandczyk", d: ["Grew up with one eye on the forest and the other on the Sea of Claws.", "Dorastał z jednym okiem na lesie, a drugim na Morzu Szponów."], c: { t: 5, ag: 5 }, s: { Swim: 10, "Outdoor Survival": 10, Row: 5 }, t: ["Fisherman"] },
      { id: "hochlander", en: "Hochlander", pl: "Hochlandczyk", d: ["Hunts in the deep woods and swears that a long rifle is a family heirloom.", "Poluje w głębokich lasach i przysięga, że długa strzelba to rodzinna pamiątka."], c: { bs: 10 }, s: { "Ranged (Blackpowder)": 10, Track: 10, Perception: 5 }, t: ["Hunter's Eye"] },
      { id: "kislevite", en: "Kislevite", pl: "Kislevita", d: ["Born to the steppe's cold and to the sound of hooves in the dark.", "Urodzony w chłodzie stepu, przy tętencie kopyt w ciemności."], c: { t: 5, wp: 5 }, s: { "Language (Gospodarinyi)": 20, "Ride (Horse)": 15, "Consume Alcohol": 10 }, t: ["Roughrider"] },
      { id: "tilean", en: "Tilean", pl: "Tileańczyk", d: ["Quick with a blade, quicker with a contract and always owed money.", "Szybki z ostrzem, jeszcze szybszy z umową i zawsze ktoś jest mu winien pieniądze."], c: { i: 5, fel: 5 }, s: { "Language (Tilean)": 20, Haggle: 10, "Melee (Fencing)": 5 }, t: ["Dealmaker"] },
      { id: "bretonnian", en: "Bretonnian", pl: "Bretończyk", d: ["Knows exactly where everyone stands, and has an opinion of the Empire's manners.", "Dokładnie wie, kto jakie ma miejsce, i ma zdanie o manierach w Imperium."], c: { fel: 5, wp: 5 }, s: { "Language (Bretonnian)": 20, "Lore (Heraldry)": 10, Charm: 5 }, t: ["Etiquette (Nobles)"] },
      { id: "estalian", en: "Estalian", pl: "Estalijczyk", d: ["Proud, sharp-tongued and trained to settle both with a rapier.", "Dumny, cięty w mowie i nauczony załatwiać oba problemy rapierem."], c: { ag: 5, fel: 5 }, s: { "Language (Estalian)": 20, "Melee (Fencing)": 10, Charm: 5 }, t: ["Feint"] },
      { id: "norscan", en: "Norscan", pl: "Norsmen", d: ["Came across the sea to trade. Trade was not the first plan.", "Przybył zza morza, żeby handlować. Handel nie był pierwszym pomysłem."], c: { s: 10, t: 5, fel: -5 }, s: { "Language (Norse)": 20, "Melee (Two-Handed)": 10, "Consume Alcohol": 10, Row: 5 }, t: ["Sea Legs"] }
    ]
  },
  {
    id: "trades", en: "Walks of Life", pl: "Fach", icon: "icons/svg/house.svg",
    items: [
      { id: "innkeeper", en: "Innkeeper", pl: "Karczmarz", d: ["Remembers every face, every tab and every fight that broke a chair.", "Pamięta każdą twarz, każdy dług i każdą bójkę, w której pękło krzesło."], c: { fel: 5 }, s: { Gossip: 15, Haggle: 10, "Consume Alcohol": 10 }, t: ["Gregarious"] },
      { id: "blacksmith", en: "Blacksmith", pl: "Kowal", d: ["Arms like tree roots and little patience for people who rush good work.", "Ramiona jak korzenie i mało cierpliwości do tych, co poganiają dobrą robotę."], c: { s: 10, t: 5 }, s: { "Trade (Smith)": 20, "Melee (Two-Handed)": 5, Endurance: 5 }, t: ["Strong Back", "Craftsman"] },
      { id: "farmer", en: "Farmer", pl: "Chłop", d: ["Up before dawn, knows the weather and has buried too many harvests.", "Wstaje przed świtem, zna się na pogodzie i pogrzebał już zbyt wiele plonów."], c: { s: 5, t: 5 }, s: { "Outdoor Survival": 10, Endurance: 10, "Animal Care": 10 }, t: ["Stone Soup"] },
      { id: "scribe", en: "Scribe", pl: "Skryba", d: ["Ink-stained, short-sighted and in possession of everyone's paperwork.", "Upstrzony atramentem, krótkowzroczny i w posiadaniu wszystkich dokumentów."], c: { int: 10, s: -5 }, s: { Research: 15, "Lore (Law)": 5, "Language (Classical)": 10 }, t: ["Read/Write", "Bookish"] },
      { id: "miner", en: "Miner", pl: "Górnik", d: ["Knows what lives under the hill and why the third shaft was sealed.", "Wie, co żyje pod wzgórzem i czemu zasypano trzeci szyb."], c: { s: 5, t: 10 }, s: { Endurance: 15, Perception: 5, "Lore (Geology)": 10 }, t: ["Tunnel Rat", "Sturdy"] },
      { id: "coachman", en: "Coachman", pl: "Woźnica", d: ["Has driven through every bad road and has a blunderbuss for the worst.", "Jeździł każdą złą drogą, a na najgorsze ma garłacz."], c: { i: 5, wp: 5 }, s: { Drive: 20, "Animal Care": 10, "Ranged (Blackpowder)": 5 }, t: ["Seasoned Traveller"] },
      { id: "servant", en: "Servant", pl: "Służący", d: ["Silent, invisible and aware of precisely who visited the master last night.", "Cichy, niewidzialny i świetnie wie, kto zeszłej nocy odwiedził pana domu."], c: { i: 5 }, s: { Perception: 10, Gossip: 10, "Stealth (Urban)": 5 }, t: ["Beneath Notice"] },
      { id: "beggar", en: "Beggar", pl: "Żebrak", d: ["Everyone looks away, which makes this the best seat on the street.", "Wszyscy odwracają wzrok, więc to najlepsze miejsce na całej ulicy."], c: { t: -5, fel: 5 }, s: { Charm: 15, Gossip: 10, "Stealth (Urban)": 5 }, t: ["Panhandle", "Beneath Notice"] },
      { id: "entertainer", en: "Entertainer", pl: "Kuglarz", d: ["Juggles, sings and leaves town shortly before the bill arrives.", "Żongluje, śpiewa i wyjeżdża z miasta tuż przed nadejściem rachunku."], c: { ag: 5, fel: 10 }, s: { "Perform (Juggling)": 20, "Entertain (Singing)": 15, Charm: 5 }, t: ["Public Speaker"] },
      { id: "butcher", en: "Butcher", pl: "Rzeźnik", d: ["Handy with a cleaver and unbothered by the sight of what is inside.", "Sprawnie włada tasakiem i nie rusza go widok tego, co w środku."], c: { s: 5, wp: 5 }, s: { "Melee (Basic)": 10, Cool: 10, Intimidate: 5 }, t: ["Strike to Injure"] },
      { id: "fisher", en: "Fisher", pl: "Rybak", d: ["Patient, weather-beaten and willing to tell you about the one that got away.", "Cierpliwy, ogorzały i chętnie opowie o tej, która mu uciekła."], c: { dex: 5, t: 5 }, s: { Row: 15, Swim: 10, "Outdoor Survival": 5 }, t: ["Fisherman"] }
    ]
  },
  {
    id: "training", en: "Combat Training", pl: "Szkoła walki", icon: "icons/svg/combat.svg",
    items: [
      { id: "shield-wall", en: "Shield Wall", pl: "Mur tarcz", d: ["Drilled to hold the line and to keep the next man's flank covered.", "Wyszkolony, by trzymać szereg i osłaniać bok sąsiada."], c: { t: 5, wp: 5 }, s: { "Melee (Basic)": 10, Endurance: 5, Cool: 10 }, t: ["Shieldsman", "Drilled"] },
      { id: "skirmisher", en: "Skirmisher", pl: "Harcownik", d: ["Strikes from the edge of the fight and is gone before the reply.", "Uderza ze skraju walki i znika, zanim padnie odpowiedź."], c: { bs: 5, i: 5, ag: 10 }, s: { Dodge: 15, Athletics: 10, "Ranged (Throwing)": 10 }, t: ["Fleet Footed", "Step Aside"] },
      { id: "berserker", en: "Berserker", pl: "Berserker", d: ["Stops thinking at the first blood and stops feeling shortly after.", "Przestaje myśleć przy pierwszej krwi, a czuć zaraz potem."], c: { ws: 5, s: 10, t: 5, int: -10 }, s: { "Melee (Two-Handed)": 15, Intimidate: 10 }, t: ["Frenzy", "Berserk Charge", "Battle Rage", "Glorious Demise"] },
      { id: "marksman", en: "Marksman", pl: "Strzelec wyborowy", d: ["Holds a breath, counts a heartbeat and ends an argument at long range.", "Wstrzymuje oddech, liczy uderzenie serca i kończy spór z daleka."], c: { bs: 15, i: 5 }, s: { "Ranged (Bow)": 15, "Ranged (Crossbow)": 15, Perception: 10 }, t: ["Accurate Shot", "Sure Shot", "Marksman"] },
      { id: "swordmaster", en: "Fencing Master", pl: "Mistrz fechtunku", d: ["Teaches the art for money and practises it, without warning, for free.", "Uczy sztuki za pieniądze, a ćwiczy ją bez ostrzeżenia i za darmo."], c: { ws: 15, ag: 10, i: 5 }, s: { "Melee (Fencing)": 20, "Melee (Parry)": 15, Dodge: 10 }, t: ["Riposte", "Feint", "Beat Blade"] },
      { id: "cavalry", en: "Cavalry Trooper", pl: "Kawalerzysta", d: ["Half the height of a charge is the horse, and the other half is nerve.", "Połowa szarży to koń, a druga połowa to odwaga."], c: { ws: 5, ag: 5, wp: 5 }, s: { "Ride (Horse)": 20, "Melee (Cavalry)": 15, "Animal Care": 5 }, t: ["Roughrider", "Trick Riding"] },
      { id: "street-brawler", en: "Street Brawler", pl: "Uliczny zabijaka", d: ["Learned to fight in alleys, where the first rule is that there are none.", "Walczyć uczył się w zaułkach, gdzie pierwsza zasada mówi, że zasad nie ma."], c: { s: 5, t: 5, i: 5 }, s: { "Melee (Brawling)": 20, Intimidate: 10, Dodge: 5 }, t: ["Dirty Fighting", "In-fighter", "Iron Jaw"] },
      { id: "assassin-trained", en: "Trained Killer", pl: "Wyszkolony zabójca", d: ["Takes the job, leaves no witnesses and invoices through a third party.", "Przyjmuje zlecenie, nie zostawia świadków i wystawia rachunek przez pośrednika."], c: { ws: 10, i: 10, ag: 10 }, s: { "Melee (Basic)": 15, "Stealth (Urban)": 20, Perception: 10 }, t: ["Strike to Injure", "Shadow", "Careful Strike"] }
    ]
  },
  {
    id: "faith", en: "Faith", pl: "Wiara", icon: "icons/svg/temple.svg",
    items: [
      { id: "sigmarite", en: "Sigmar's Faithful", pl: "Wierny Sigmara", d: ["Wears the hammer openly and looks hard at those who do not.", "Nosi młot na widoku i przygląda się uważnie tym, którzy tego nie robią."], c: { wp: 10 }, s: { Pray: 10, "Lore (Theology)": 5, Cool: 10 }, t: [] },
      { id: "ulrican", en: "Ulric's Faithful", pl: "Wierny Ulryka", d: ["Prays with a clenched fist, and only when the weather is bad enough.", "Modli się z zaciśniętą pięścią i tylko przy dostatecznie złej pogodzie."], c: { s: 5, t: 5, fel: -5 }, s: { Pray: 10, Endurance: 10, Intimidate: 5 }, t: ["Stout-hearted"] },
      { id: "shallyan", en: "Shallya's Faithful", pl: "Wierny Shallyi", d: ["Tends the dying without asking which side they were fighting on.", "Opiekuje się umierającymi, nie pytając, po której stronie walczyli."], c: { fel: 10, ws: -5 }, s: { Heal: 15, Pray: 10, Charm: 5 }, t: ["Pure Soul"] },
      { id: "morrite", en: "Morr's Faithful", pl: "Wierny Morra", d: ["Calm in the presence of the dead, and quietly unnerving to the living.", "Spokojny przy zmarłych i po cichu niepokojący dla żywych."], c: { wp: 10 }, s: { Pray: 10, Cool: 15 }, t: ["Fearless (Undead)"] },
      { id: "ranaldan", en: "Ranald's Faithful", pl: "Wierny Ranalda", d: ["Crosses fingers instead of praying, and bets on the outcome anyway.", "Zamiast się modlić, krzyżuje palce, a na wynik i tak się zakłada."], c: { dex: 5, fel: 5 }, s: { Gamble: 15, "Sleight of Hand": 10, Charm: 5 }, t: ["Luck"] },
      { id: "flagellant", en: "Flagellant", pl: "Biczownik", d: ["Bleeds gladly for the end of the world and would like company.", "Chętnie krwawi w imię końca świata i szuka towarzystwa."], c: { t: 5, wp: 15, fel: -15, int: -5 }, s: { Endurance: 20, Intimidate: 10, "Melee (Flail)": 15 }, t: ["Flagellant", "Frenzy", "Implacable"] },
      { id: "witch-hunter-agent", en: "Templar's Informer", pl: "Donosiciel templariuszy", d: ["Writes down names and passes them to men in wide hats.", "Spisuje nazwiska i przekazuje je panom w szerokich kapeluszach."], c: { i: 5, int: 5, wp: 5 }, s: { Intuition: 15, Gossip: 15, "Lore (Theology)": 5 }, t: ["Nose for Trouble", "Read/Write"] },
      { id: "doubter", en: "Secret Doubter", pl: "Skryty wątpiący", d: ["Mouths the prayers and quietly reads books that have been burned elsewhere.", "Porusza ustami w modlitwie, a po cichu czyta księgi spalone gdzie indziej."], c: { int: 5, fel: 5 }, s: { Research: 10, Charm: 10, Cool: 5 }, t: ["Secret Identity"] }
    ]
  },
  {
    id: "afflictions", en: "Afflictions", pl: "Przypadłości", icon: "icons/svg/degen.svg",
    items: [
      { id: "plague-ridden", en: "Plague-Ridden", pl: "Zadżumiony", d: ["Coughs into a rag that no one should look at closely.", "Kaszle w szmatę, której nikt nie powinien oglądać z bliska."], c: { s: -10, t: -10, fel: -10 }, s: { Endurance: 10 }, t: [] },
      { id: "one-eyed", en: "One-Eyed", pl: "Jednooki", d: ["Lost the eye years ago and tells a different story about it every night.", "Stracił oko przed laty i co wieczór opowiada o tym inaczej."], c: { bs: -15, i: -5 }, s: { Intimidate: 10, Gossip: 5 }, t: [] },
      { id: "starving", en: "Starving", pl: "Wygłodzony", d: ["All ribs and eyes. Will do remarkable things for bread.", "Same żebra i oczy. Za chleb zrobi rzeczy zadziwiające."], c: { s: -10, t: -10, ag: -5, wp: -5 }, s: {}, t: [] },
      { id: "madman", en: "Unhinged", pl: "Obłąkany", d: ["Holds long conversations with someone standing just behind you.", "Prowadzi długie rozmowy z kimś, kto stoi tuż za tobą."], c: { i: 5, int: -10, wp: 10, fel: -15 }, s: { Intimidate: 10, Perception: 5 }, t: ["Strong-minded"] },
      { id: "hunchback", en: "Hunchback", pl: "Garbus", d: ["Bent by birth or by labour and stronger than the mockers expected.", "Pochylony od urodzenia lub od pracy, silniejszy, niż sądzili szydercy."], c: { s: 5, t: 5, ag: -10, fel: -10 }, s: { Endurance: 10, "Stealth (Urban)": 5 }, t: ["Strong Back"] },
      { id: "exhausted", en: "Exhausted", pl: "Wycieńczony", d: ["Has not slept properly since the last village, or possibly the one before.", "Nie spał porządnie od ostatniej wsi, a może i od przedostatniej."], c: { ws: -10, bs: -10, i: -15, ag: -10 }, s: {}, t: [] },
      { id: "cursed", en: "Cursed", pl: "Przeklęty", d: ["Dogs bark, milk sours, and something is due to collect before winter.", "Psy szczekają, mleko kwaśnieje, a przed zimą coś upomni się o dług."], c: { wp: -5, fel: -10 }, s: { Cool: 5 }, t: ["Doomed"] },
      { id: "scarred", en: "Horribly Scarred", pl: "Straszliwie okaleczony", d: ["The face tells the tale nobody wants to hear twice.", "Twarz opowiada historię, której nikt nie chce usłyszeć drugi raz."], c: { fel: -15, wp: 5 }, s: { Intimidate: 20 }, t: ["Menacing"] }
    ]
  },
  {
    id: "dark-pacts", en: "Dark Pacts", pl: "Mroczne konszachty", icon: "icons/svg/blood.svg",
    items: [
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
    id: "status", en: "Reputation", pl: "Pozycja", icon: "icons/svg/hanging-sign.svg",
    items: [
      { id: "wealthy-patron", en: "Wealthy Patron", pl: "Bogaty mecenas", d: ["Solves most problems with a purse and the rest with someone else's sword.", "Większość spraw załatwia sakiewką, a resztę cudzym mieczem."], c: { fel: 10, s: -5 }, s: { Bribery: 20, Charm: 10, Evaluate: 10 }, t: ["Wealthy", "Dealmaker"] },
      { id: "local-hero", en: "Local Hero", pl: "Lokalny bohater", d: ["Saved the village once, and has been drinking for free ever since.", "Raz uratował wieś i od tamtej pory pije za darmo."], c: { wp: 5, fel: 10 }, s: { Leadership: 10, "Consume Alcohol": 10, Charm: 10 }, t: ["Inspiring"] },
      { id: "spy", en: "Spy", pl: "Szpieg", d: ["Has three names, two employers and one way out of every room.", "Ma trzy nazwiska, dwóch pracodawców i jedną drogę ucieczki z każdego pokoju."], c: { i: 5, int: 5, fel: 5 }, s: { Gossip: 15, "Stealth (Urban)": 15, Intuition: 10 }, t: ["Secret Identity", "Master of Disguise", "Lip Reading"] },
      { id: "disgraced", en: "Disgraced", pl: "Zhańbiony", d: ["Once somebody of note. Now avoids the crests of certain families.", "Kiedyś ktoś znaczny. Dziś unika herbów pewnych rodów."], c: { wp: -5, fel: -10, ws: 5 }, s: { "Consume Alcohol": 15, Cool: 5 }, t: ["Etiquette (Nobles)"] },
      { id: "wanted", en: "Wanted", pl: "Poszukiwany", d: ["There is a drawing of this face on the gate. It is not flattering.", "Rysunek tej twarzy wisi na bramie. Nie jest pochlebny."], c: { i: 5, ag: 5, fel: -5 }, s: { "Stealth (Urban)": 15, Dodge: 5, Cool: 10 }, t: ["Flee!", "Criminal"] },
      { id: "corrupt-official", en: "Corrupt Official", pl: "Skorumpowany urzędnik", d: ["Every stamp has a price, and today's price has gone up.", "Każda pieczątka ma swoją cenę, a dziś cena wzrosła."], c: { int: 5, fel: 5 }, s: { Bribery: 20, "Lore (Law)": 15, Charm: 5 }, t: ["Read/Write", "Embezzle"] }
    ]
  }
];
