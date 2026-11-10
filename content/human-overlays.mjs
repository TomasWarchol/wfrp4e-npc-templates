/**
 * Tło ludzi: pochodzenie, fach, wiara i pozycja. Łączą się z dowolnym szablonem i nie zmieniają imienia.
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
