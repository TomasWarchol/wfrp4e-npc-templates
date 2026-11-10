/**
 * Źródło zestawu szablonów. Z tego pliku powstają kompendium (packs/) i tłumaczenie (compendium/pl/).
 *
 * Stopień archetypu dziedziczy po poprzednim:
 *   c  – przyrost cech,
 *   s  – przyrost rozwinięć umiejętności,
 *   t  – kolejne talenty (powtórzenie = kolejne wykupienie),
 *   sc – wybór jednej umiejętności: { adv, of: [...] },
 *   tc – wybór jednego talentu: [[...], ...],
 *   l  – czary: { petty: liczba, any: liczba } (any = dowolna tradycja wybrana w oknie),
 *   gear – wyposażenie tego stopnia (zastępuje poprzednie; tablica = jedno do wyboru; "Nazwa*12" = ilość),
 *   pre – tytuł dopisywany przed imieniem.
 *
 * Nazwy talentów, umiejętności i przedmiotów są angielskie; moduł zamienia je na nazwy z aktywnego tłumaczenia.
 */
import { SUFFUSE_WINDS } from "./addon-talents.mjs";

const WINDS = ["Aqshy", "Azyr", "Chamon", "Ghur", "Ghyran", "Hysh", "Shyish", "Ulgu"].map((wind) => `Channelling (${wind})`);

export const ARCHETYPES = [
  {
    id: "soldier", en: "Soldier", pl: "Żołnierz", icon: "icons/svg/sword.svg",
    ranks: [
      { id: "recruit", en: "Recruit", pl: "Rekrut",
        d: ["Three weeks of drill and a borrowed helmet. Knows which end of the spear to hold.", "Trzy tygodnie musztry i pożyczony hełm. Wie już, za który koniec trzymać włócznię."],
        c: { ws: 5, t: 5 }, s: { "Melee (Basic)": 5, Dodge: 5, Cool: 5, Athletics: 5 }, t: ["Drilled"],
        gear: [["Hand Weapon", "Spear"], "Leather Jack", "Leather Skullcap"] },
      { id: "veteran", en: "Veteran", pl: "Weteran",
        d: ["Has survived enough battles to stop counting them, and has the scars to prove it.", "Przeżył tyle bitew, że przestał je liczyć, a blizny zastępują mu odznaczenia."],
        c: { ws: 5, t: 5, wp: 5, i: 5 }, s: { "Melee (Basic)": 10, Cool: 5, Endurance: 10, "Consume Alcohol": 5, Intimidate: 5, Perception: 5 }, t: ["Combat Aware", "Etiquette (Soldiers)", "Strike Mighty Blow"],
        gear: ["Hand Weapon", ["Shield", "Halberd"], "Mail Shirt", "Leather Skullcap", "Leather Jack"] },
      { id: "sergeant", en: "Sergeant", pl: "Sierżant", pre: ["Sergeant", "Sierżant"],
        d: ["The voice everyone obeys when the line starts to bend. Feared more than the enemy.", "Głos, którego wszyscy słuchają, gdy szereg zaczyna się chwiać. Budzi większy strach niż wróg."],
        c: { ws: 5, wp: 5, fel: 10 }, s: { "Melee (Basic)": 5, Leadership: 15, Intimidate: 10, "Lore (Warfare)": 10, Cool: 5 }, t: ["Commanding Presence", "Inspiring"],
        tc: [["Reaction Strike", "Strike to Stun", "Shieldsman"]],
        gear: ["Hand Weapon", "Shield", "Mail Coat", "Mail Coif", "Plate Breastplate", "Leather Leggings", "Uniform"] },
      { id: "captain", en: "Captain", pl: "Kapitan", pre: ["Captain", "Kapitan"],
        d: ["Commands a company, buys its ale and answers for its dead.", "Dowodzi kompanią, stawia jej piwo i odpowiada za jej poległych."],
        c: { ws: 10, i: 5, int: 10, fel: 5 }, s: { "Melee (Basic)": 10, Leadership: 15, "Lore (Warfare)": 10, "Ride (Horse)": 15, Gossip: 5 }, t: ["War Leader", "Combat Master", "Read/Write", "Strike Mighty Blow"],
        gear: ["Hand Weapon", "Shield", "Plate Breastplate", "Plate Helm", "Mail Coat", "Plate Leggings", "Plate Bracers", "Signet Ring"] }
    ]
  },
  {
    id: "watch", en: "City Watch", pl: "Straż miejska", icon: "icons/svg/shield.svg",
    ranks: [
      { id: "night-watchman", en: "Night Watchman", pl: "Nocny stróż",
        d: ["Walks the lamplit streets with a lantern, a cudgel and a keen wish to be elsewhere.", "Przemierza ulice z latarnią i pałką, marząc głównie o tym, by być gdzie indziej."],
        c: { i: 5, wp: 5 }, s: { Perception: 10, "Melee (Basic)": 5, Gossip: 5, Cool: 5 }, t: ["Night Vision"],
        gear: ["Baton", "Leather Jack", "Storm Lantern"] },
      { id: "watchman", en: "Watchman", pl: "Strażnik miejski",
        d: ["Knows every tavern, every informer and precisely how much a bribe should be.", "Zna każdą karczmę, każdego donosiciela i dokładną wysokość należnej łapówki."],
        c: { ws: 5, fel: 5, t: 5 }, s: { "Melee (Basic)": 5, Intimidate: 10, Intuition: 10, "Lore (Law)": 5, Bribery: 5 }, t: ["Strike to Stun", "Etiquette (Guards)"],
        gear: ["Hand Weapon", "Baton", "Leather Jack", "Leather Skullcap", "Manacles", "Uniform"] },
      { id: "watch-sergeant", en: "Watch Sergeant", pl: "Sierżant straży", pre: ["Sergeant", "Sierżant"],
        d: ["Keeps a district quiet by knowing who to arrest and who to warn first.", "Utrzymuje spokój w dzielnicy, bo wie, kogo aresztować, a kogo najpierw ostrzec."],
        c: { ws: 5, int: 5, wp: 5, fel: 5 }, s: { Leadership: 15, "Lore (Law)": 10, Intuition: 5, Perception: 5, Intimidate: 5 }, t: ["Nose for Trouble", "Read/Write"],
        gear: ["Hand Weapon", "Baton", "Mail Shirt", "Leather Jack", "Leather Skullcap", "Manacles", "Uniform"] },
      { id: "watch-captain", en: "Watch Captain", pl: "Kapitan straży", pre: ["Captain", "Kapitan"],
        d: ["Half officer, half politician. Every magistrate in town owes a favour, or fears one.", "Po części oficer, po części polityk. Każdy sędzia w mieście ma u niego dług albo się go boi."],
        c: { ws: 5, int: 5, wp: 5, fel: 10 }, s: { "Melee (Basic)": 10, Leadership: 10, "Lore (Law)": 10, Charm: 10, Bribery: 5 }, t: ["Commanding Presence", "Schemer", "Etiquette (Nobles)"],
        gear: ["Hand Weapon", "Mail Coat", "Plate Breastplate", "Plate Open Helm", "Uniform", "Signet Ring"] }
    ]
  },
  {
    id: "outlaw", en: "Outlaw", pl: "Banita", icon: "icons/svg/net.svg",
    ranks: [
      { id: "footpad", en: "Footpad", pl: "Rabuś",
        d: ["Hungry, desperate and waiting in the ditch for someone who looks weaker.", "Głodny, zdesperowany i czeka w rowie na kogoś, kto wygląda na słabszego."],
        c: { ag: 5, ws: 5 }, s: { "Melee (Basic)": 5, "Stealth (Rural)": 10, "Outdoor Survival": 5 }, t: ["Flee!"],
        gear: [["Hand Weapon", "Quarterstaff"], "Leather Jerkin", "Rags"] },
      { id: "bandit", en: "Bandit", pl: "Bandyta",
        d: ["Part of a band that takes a toll on the road, in coin or in blood.", "Członek bandy, która pobiera myto na gościńcu, w monecie albo we krwi."],
        c: { ws: 5, bs: 5, t: 5 }, s: { "Melee (Basic)": 5, "Ranged (Bow)": 10, Intimidate: 10, "Stealth (Rural)": 5, Dodge: 5 }, t: ["Dirty Fighting", "Rover"],
        gear: ["Hand Weapon", "Shortbow", "Arrow*12", "Leather Jack", "Hood"] },
      { id: "highwayman", en: "Highwayman", pl: "Rozbójnik",
        d: ["Dashing, well mounted and a legend in the taverns he robs.", "Efektowny, dobrze konny i sławny w karczmach, które sam okrada."],
        c: { ws: 5, ag: 5, fel: 10 }, s: { "Melee (Basic)": 10, "Ride (Horse)": 15, Charm: 10, "Ranged (Blackpowder)": 10 }, t: ["Roughrider", "Fast Shot", "Suave"],
        gear: ["Hand Weapon", "Pistol", "Bullet and Powder*6", "Leather Jack", "Mask", "Cloak"] },
      { id: "bandit-chief", en: "Bandit Chief", pl: "Herszt",
        d: ["Holds the band together with gold, charisma and one public example each season.", "Trzyma bandę w ryzach złotem, charyzmą i jednym publicznym przykładem na sezon."],
        c: { ws: 10, s: 5, t: 5, wp: 10 }, s: { "Melee (Basic)": 15, Leadership: 20, Intimidate: 10, Gamble: 10 }, t: ["Menacing", "Combat Reflexes", "Strike Mighty Blow"],
        tc: [["Furious Assault", "Riposte", "Dual Wielder"]],
        gear: ["Hand Weapon", "Shield", "Mail Shirt", "Leather Jack", "Leather Skullcap", "Jewellery"] }
    ]
  },
  {
    id: "cultist", en: "Cultist", pl: "Kultysta", icon: "icons/svg/cowled.svg",
    ranks: [
      { id: "cult-initiate", en: "Cult Initiate", pl: "Adept kultu",
        d: ["An ordinary neighbour with a dangerous secret and a meeting on Thursday.", "Zwyczajny sąsiad z niebezpieczną tajemnicą i spotkaniem w każdy czwartek."],
        c: { wp: 5, fel: 5 }, s: { Cool: 5, "Melee (Basic)": 5, "Stealth (Urban)": 5, Gossip: 5 }, t: ["Secret Identity"],
        gear: ["Knife", "Robes", "Amulet"] },
      { id: "cultist", en: "Cultist", pl: "Kultysta",
        d: ["Has seen the rite performed and asks only when it will be done again.", "Widział już rytuał i pyta tylko, kiedy zostanie odprawiony ponownie."],
        c: { wp: 5, i: 5, ws: 5 }, s: { Cool: 10, "Melee (Basic)": 10, Intuition: 5, Charm: 5 }, t: ["Etiquette (Cultists)", "Schemer"],
        gear: ["Hand Weapon", "Dagger", "Robes", "Amulet"] },
      { id: "cult-zealot", en: "Cult Zealot", pl: "Zelota kultu",
        d: ["Does the cult's bloody work, smiling, and sings while doing it.", "Odwala krwawą robotę kultu z uśmiechem i śpiewem na ustach."],
        c: { ws: 10, s: 5, t: 5, wp: 10, fel: -5 }, s: { "Melee (Basic)": 10, Intimidate: 15, Endurance: 10 }, t: ["Frenzy", "Implacable", "Fearless (Witch Hunters)"],
        gear: ["Hand Weapon", ["Great Axe", "Shield"], "Leather Jack", "Mask"] },
      { id: "cult-leader", en: "Cult Leader", pl: "Przywódca kultu",
        d: ["Respected in daylight and worshipped by torchlight. Nobody suspects, until it is late.", "Szanowany za dnia, czczony przy pochodniach. Nikt nie podejrzewa, póki nie jest za późno."],
        c: { i: 5, int: 10, wp: 5, fel: 15, ws: -5, t: -5 }, s: { Leadership: 20, Charm: 20, "Lore (Theology)": 15, Bribery: 10, "Language (Magick)": 10 }, t: ["Master Orator", "Read/Write", "Public Speaker", "Secret Identity"],
        gear: ["Dagger", "Courtly Garb", "Signet Ring", "Book, Religion"] }
    ]
  },
  {
    id: "hunter", en: "Hunter", pl: "Łowca", icon: "icons/svg/pawprint.svg",
    ranks: [
      { id: "trapper", en: "Trapper", pl: "Traper",
        d: ["Walks the same forest paths each dawn and checks every snare.", "O świcie obchodzi te same leśne ścieżki i sprawdza każde sidła."],
        c: { dex: 5, i: 5 }, s: { "Set Trap": 15, "Outdoor Survival": 10, Track: 5, "Stealth (Rural)": 5 }, t: ["Trapper"],
        gear: ["Knife", "Animal Trap", "Leather Jerkin", "Rope, 10 yards"] },
      { id: "hunter", en: "Hunter", pl: "Myśliwy",
        d: ["A patient shot who can read last night's weather in a broken twig.", "Cierpliwy strzelec, który ze złamanej gałązki odczyta wczorajszą pogodę."],
        c: { bs: 10, ag: 5, t: 5 }, s: { "Ranged (Bow)": 15, Track: 10, Perception: 10, "Stealth (Rural)": 10, "Outdoor Survival": 5 }, t: ["Accurate Shot", "Hunter's Eye", "Strider (Woodlands)"],
        gear: ["Hand Weapon", "Bow", "Arrow*20", "Leather Jack", "Cloak"] },
      { id: "road-warden", en: "Road Warden", pl: "Strażnik dróg",
        d: ["Lone rider between lonely villages, where help is two days away.", "Samotny jeździec między samotnymi wsiami, gdzie pomoc jest o dwa dni drogi."],
        c: { ws: 5, bs: 5, wp: 5, fel: 5 }, s: { "Ride (Horse)": 20, "Melee (Basic)": 15, "Ranged (Crossbow)": 15, Intimidate: 10, "Lore (Law)": 5 }, t: ["Roughrider", "Seasoned Traveller", "Combat Aware", "Harpooner"],
        gear: ["Hand Weapon", "Crossbow", "Bolt*12", "Mail Shirt", "Leather Jack", "Leather Skullcap", "Saddle and Harness"] },
      { id: "beast-slayer", en: "Beast Slayer", pl: "Pogromca bestii",
        d: ["Collects bounties and teeth. Knows exactly where the monster's hide is thinnest.", "Zbiera nagrody i kły. Wie dokładnie, gdzie skóra potwora jest najcieńsza."],
        c: { ws: 10, bs: 5, s: 5, t: 5, wp: 5 }, s: { "Melee (Two-Handed)": 20, "Ranged (Bow)": 10, Track: 15, "Lore (Beasts)": 15, Cool: 15 }, t: ["Fearless (Monsters)", "Sharpshooter", "Strike to Injure", "Slayer"],
        gear: ["Great Axe", "Hand Weapon", "Bow", "Arrow*20", "Mail Coat", "Leather Jack", "Leather Skullcap"] }
    ]
  },
  {
    id: "sailor", en: "River & Sea", pl: "Rzeka i morze", icon: "icons/svg/waterfall.svg",
    ranks: [
      { id: "deckhand", en: "Deckhand", pl: "Majtek",
        d: ["Hauls rope for pennies and sings badly enough to scare the river trolls.", "Ciągnie liny za grosze i śpiewa tak fatalnie, że płoszy rzeczne trolle."],
        c: { s: 5, ag: 5 }, s: { Row: 10, Swim: 10, Climb: 10, "Consume Alcohol": 5 }, t: ["Strong Swimmer", "Chanty"],
        gear: ["Knife", "Boat Hook", "Clothing"] },
      { id: "smuggler", en: "Smuggler", pl: "Przemytnik",
        d: ["Moves the cargo at night and pays exactly the right customs officer.", "Przewozi towar nocą i płaci dokładnie właściwemu celnikowi."],
        c: { ag: 5, dex: 5, fel: 5, i: 5 }, s: { "Sail (Barge)": 15, Bribery: 10, Haggle: 10, "Stealth (Rural)": 10, Evaluate: 5 }, t: ["Waterman", "Fisherman", "Etiquette (Criminals)"],
        gear: ["Hand Weapon", "Dagger", "Leather Jack", "Storm Lantern", "Canvas Tarp"] },
      { id: "reaver", en: "Reaver", pl: "Łupieżca",
        d: ["Boards other people's ships and leaves them lighter, or burning.", "Wchodzi na cudze statki i zostawia je lżejsze albo w płomieniach."],
        c: { ws: 10, s: 5, t: 5 }, s: { "Melee (Basic)": 20, Intimidate: 15, Dodge: 10, Climb: 5 }, t: ["Sea Legs", "Dirty Fighting", "Strike Mighty Blow"],
        tc: [["Furious Assault", "Enclosed Fighter"]],
        gear: ["Hand Weapon", "Dagger", ["Shield (Buckler)", "Pistol"], "Leather Jack", "Boots"] },
      { id: "ship-captain", en: "Ship's Captain", pl: "Szyper", pre: ["Captain", "Kapitan"],
        d: ["Knows every shoal and every harbourmaster's price, and rules the deck like a tyrant.", "Zna każdą mieliznę i cenę każdego kapitana portu, a na pokładzie rządzi jak tyran."],
        c: { i: 5, int: 10, wp: 5, fel: 10 }, s: { Leadership: 20, Navigation: 20, "Sail (Cog)": 20, "Lore (Geography)": 10 }, t: ["Old Salt", "Orientation", "Read/Write", "Commanding Presence", "Master and Commander"],
        gear: ["Hand Weapon", "Pistol", "Bullet and Powder*6", "Mail Shirt", "Telescope", "Map", "Coat"] }
    ]
  },
  {
    id: "noble", en: "Nobility", pl: "Szlachta", icon: "icons/svg/upgrade.svg",
    ranks: [
      { id: "scion", en: "Scion", pl: "Panicz",
        d: ["Young, rich and convinced the world was arranged for their amusement.", "Młody, bogaty i przekonany, że świat urządzono dla jego rozrywki."],
        c: { fel: 5, int: 5 }, s: { Charm: 5, Gamble: 5, "Melee (Fencing)": 5, "Consume Alcohol": 5 }, t: ["Noble Blood", "Etiquette (Nobles)"],
        gear: ["Foil", "Courtly Garb", "Jewellery"] },
      { id: "courtier", en: "Courtier", pl: "Dworzanin",
        d: ["Fights with whispers, invitations and strategically timed compliments.", "Walczy szeptem, zaproszeniami i starannie wymierzonymi komplementami."],
        c: { i: 5, int: 5, fel: 10 }, s: { Charm: 15, Gossip: 15, Intuition: 10, "Lore (Heraldry)": 10, Bribery: 5 }, t: ["Read/Write", "Schemer", "Suave"],
        gear: ["Dagger", "Courtly Garb", "Jewellery", "Perfume"] },
      { id: "duellist", en: "Duellist", pl: "Pojedynkowicz",
        d: ["Takes offence easily and leaves elegant, very small holes in those who cause it.", "Łatwo się obraża i zostawia eleganckie, bardzo małe dziury w tych, którzy to sprawili."],
        c: { ws: 15, i: 10, ag: 10, s: -5 }, s: { "Melee (Fencing)": 25, "Melee (Parry)": 15, Dodge: 15, Cool: 15, "Perform (Dancing)": 5 }, t: ["Riposte", "Reaction Strike", "Beat Blade", "Feint"],
        gear: ["Rapier", "Main Gauche", "Leather Jack", "Courtly Garb"] },
      { id: "noble-lord", en: "Noble Lord", pl: "Wielmoża", pre: ["Lord", "Pan"],
        d: ["Owns the land, the mill and most of the local magistrates.", "Do niego należy ziemia, młyn i większość okolicznych sędziów."],
        c: { wp: 10, fel: 10, int: 5 }, s: { Leadership: 25, "Lore (Law)": 10, "Ride (Horse)": 20, Evaluate: 10, Intimidate: 10 }, t: ["Commanding Presence", "Wealthy", "Master Orator"],
        gear: ["Rapier", "Plate Breastplate", "Mail Coat", "Courtly Garb", "Signet Ring", "Jewellery", "Saddle and Harness"] }
    ]
  },
  {
    id: "merchant", en: "Trade", pl: "Handel", icon: "icons/svg/item-bag.svg",
    ranks: [
      { id: "peddler", en: "Peddler", pl: "Domokrążca",
        d: ["Goes from village to village with ribbons, news and a suspicious ointment.", "Wędruje od wsi do wsi ze wstążkami, plotkami i podejrzaną maścią."],
        c: { fel: 5, t: 5 }, s: { Haggle: 10, Gossip: 10, Charm: 5, Endurance: 5 }, t: ["Seasoned Traveller"],
        gear: ["Knife", "Backpack", "Clothing"] },
      { id: "trader", en: "Trader", pl: "Handlarz",
        d: ["Counts on an abacus, remembers every debt and never quotes the real price first.", "Liczy na liczydle, pamięta każdy dług i nigdy nie podaje najpierw prawdziwej ceny."],
        c: { int: 5, fel: 5 }, s: { Haggle: 10, Evaluate: 15, Charm: 5, "Language (Tilean)": 5 }, t: ["Read/Write", "Dealmaker", "Etiquette (Guilders)"],
        gear: ["Hand Weapon", "Abacus", "Clothing", "Writing Kit"] },
      { id: "merchant", en: "Merchant", pl: "Kupiec",
        d: ["Hires guards, bribes tax collectors and owns at least one warehouse too many.", "Najmuje strażników, przekupuje poborców i ma o jeden magazyn za dużo."],
        c: { int: 5, wp: 5, fel: 5 }, s: { Haggle: 15, Bribery: 15, Evaluate: 10, Leadership: 10, "Lore (Law)": 5 }, t: ["Numismatics", "Super Numerate", "Wealthy"],
        gear: ["Hand Weapon", "Abacus", "Courtly Garb", "Jewellery", "Guild License"] },
      { id: "guild-master", en: "Guild Master", pl: "Mistrz cechu", pre: ["Master", "Mistrz"],
        d: ["A signature from this desk can open a city's gates or bankrupt a rival.", "Podpis złożony przy tym biurku otworzy bramy miasta albo zrujnuje rywala."],
        c: { i: 5, int: 10, fel: 10 }, s: { Leadership: 20, Charm: 20, Haggle: 15, Intuition: 15, "Lore (Law)": 15 }, t: ["Embezzle", "Schemer", "Etiquette (Nobles)", "Kingpin"],
        gear: ["Dagger", "Courtly Garb", "Signet Ring", "Jewellery", "Stamp, engraved", "Guild License"] }
    ]
  },
  {
    id: "thief", en: "Underworld", pl: "Półświatek", icon: "icons/svg/invisible.svg",
    ranks: [
      { id: "urchin", en: "Urchin", pl: "Ulicznik",
        d: ["Small, quick and invisible to everyone who should have noticed.", "Mały, szybki i niewidzialny dla każdego, kto powinien go zauważyć."],
        c: { ag: 5, i: 5, s: -5 }, s: { "Stealth (Urban)": 10, Dodge: 10, Gossip: 5 }, t: ["Alley Cat"],
        gear: ["Knife", "Rags"] },
      { id: "pickpocket", en: "Pickpocket", pl: "Kieszonkowiec",
        d: ["Bumps into you, apologises warmly and walks off with your purse.", "Wpada na ciebie, serdecznie przeprasza i odchodzi z twoją sakiewką."],
        c: { ag: 5, dex: 15, fel: 5 }, s: { "Sleight of Hand": 20, "Stealth (Urban)": 5, Charm: 10, Evaluate: 5 }, t: ["Nimble Fingered", "Etiquette (Criminals)", "Fast Hands"],
        gear: ["Dagger", "Hood", "Clothing"] },
      { id: "burglar", en: "Burglar", pl: "Włamywacz",
        d: ["Prefers empty houses and silent locks. Has opinions about window latches.", "Woli puste domy i ciche zamki. Ma wyrobione zdanie o zasuwach okiennych."],
        c: { i: 5, ag: 10, dex: 5 }, s: { "Pick Lock": 25, Climb: 20, "Stealth (Urban)": 15, Perception: 10, "Secret Signs (Thief)": 10 }, t: ["Break and Enter", "Catfall", "Scale Sheer Surface", "Shadow"],
        gear: ["Dagger", "Lock Picks", "Crowbar", "Rope, 10 yards", "Leather Jerkin", "Hood"] },
      { id: "gang-boss", en: "Gang Boss", pl: "Szef gangu",
        d: ["Runs the docks from a back room. Nobody remembers voting.", "Rządzi dokami z zaplecza karczmy. Nikt nie pamięta głosowania."],
        c: { ws: 10, t: 5, wp: 10, fel: 10, int: 5 }, s: { Leadership: 20, Intimidate: 20, "Melee (Basic)": 20, Bribery: 15, Gamble: 10 }, t: ["Kingpin", "Menacing", "Criminal", "Dirty Fighting"],
        gear: ["Hand Weapon", "Knuckledusters", "Leather Jack", "Courtly Garb", "Jewellery"] }
    ]
  },
  {
    id: "healer", en: "Healing", pl: "Medycyna", icon: "icons/svg/heal.svg",
    ranks: [
      { id: "herbalist", en: "Herbalist", pl: "Zielarz",
        d: ["Knows which root cures and which one kills, and the small difference in dosage.", "Wie, który korzeń leczy, a który zabija, i jak niewielka to różnica w dawce."],
        c: { dex: 5, int: 5 }, s: { Heal: 10, "Outdoor Survival": 5, "Trade (Herbalist)": 10, Gossip: 5 }, t: ["Field Dressing"],
        gear: ["Knife", "Healing Poultice*2", "Pestle & Mortar", "Clothing"] },
      { id: "barber-surgeon", en: "Barber-Surgeon", pl: "Cyrulik",
        d: ["Shaves on market days and amputates on the others, with the same razor.", "W dni targowe goli, w pozostałe amputuje, tą samą brzytwą."],
        c: { dex: 10, wp: 5 }, s: { Heal: 15, Cool: 10, Charm: 5, Bribery: 5 }, t: ["Coolheaded", "Etiquette (Guilders)"],
        gear: ["Knife", "Bandage*4", "Healing Draught", "Trade Tools (Type)", "Clothing"] },
      { id: "physician", en: "Physician", pl: "Medyk",
        d: ["University educated, expensive and only occasionally fatal.", "Wykształcony na uniwersytecie, drogi i tylko czasem śmiertelny."],
        c: { int: 10, dex: 5, fel: 5 }, s: { Heal: 20, "Lore (Medicine)": 15, Research: 15, "Language (Classical)": 10 }, t: ["Read/Write", "Surgery", "Resistance (Disease)", "Bookish"],
        gear: ["Dagger", "Book, Medicine", "Bandage*6", "Healing Draught*2", "Trade Tools (Type)", "Courtly Garb"] },
      { id: "master-physician", en: "Master Physician", pl: "Doktor medycyny", pre: ["Doctor", "Doktor"],
        d: ["Called to the bedsides of counts and consulted when the plague arrives.", "Wzywany do łoża hrabiów i pierwszy, którego się radzi, gdy nadchodzi zaraza."],
        c: { int: 10, wp: 5, fel: 5, dex: 5 }, s: { Heal: 20, "Lore (Medicine)": 20, Leadership: 15, Charm: 10 }, t: ["Pharmacist", "Surgery", "Savant (Medicine)", "Etiquette (Nobles)"],
        gear: ["Dagger", "Book, Medicine", "Vitality Draught", "Healing Draught*3", "Courtly Garb", "Reading Lens"] }
    ]
  },
  {
    id: "wizard", en: "Wizardry", pl: "Magia", icon: "icons/svg/mage-shield.svg",
    ranks: [
      { id: "apprentice", en: "Wizard's Apprentice", pl: "Uczeń maga",
        d: ["Carries the books, cleans the scorch marks and has already singed both eyebrows.", "Nosi księgi, szoruje osmalenia i zdążył już przypalić obie brwi."],
        c: { int: 5, wp: 5 }, s: { "Language (Magick)": 10, "Lore (Magick)": 5, Research: 5 }, sc: [{ adv: 10, of: WINDS }], t: ["Petty Magic", "Read/Write", "Second Sight"], l: { petty: 3 },
        gear: ["Dagger", "Quarterstaff", "Robes", "Book, Magic"] },
      { id: "journeyman", en: "Journeyman Wizard", pl: "Czeladnik magii",
        d: ["Licensed at last, and sent where the College would rather not go itself.", "Wreszcie z licencją, wysyłany tam, gdzie Kolegium samo nie chce się pojawiać."],
        c: { int: 5, wp: 10, i: 5 }, s: { "Language (Magick)": 10, "Lore (Magick)": 10, Cool: 10, Intuition: 5 }, sc: [{ adv: 15, of: WINDS }], t: ["Aethyric Attunement", "Magical Sense"], l: { any: 3 },
        tc: [["Arcane Magic (Fire)", "Arcane Magic (Heavens)", "Arcane Magic (Beasts)", "Arcane Magic (Metal)", "Arcane Magic (Life)", "Arcane Magic (Light)", "Arcane Magic (Shadow)", "Arcane Magic (Death)"]],
        gear: ["Quarterstaff", "Dagger", "Robes", "Book, Magic"] },
      { id: "wizard", en: "Wizard", pl: "Czarodziej",
        d: ["Treated with fear by peasants, with suspicion by priests and with envy by rivals.", "Chłopi się go boją, kapłani podejrzewają, a rywale zazdroszczą."],
        c: { int: 5, wp: 10, fel: 5 }, s: { "Lore (Magick)": 15, Charm: 10, Leadership: 5 }, sc: [{ adv: 15, of: WINDS }], t: ["Instinctive Diction", "Aethyric Attunement", "Iron Will"], tc: [SUFFUSE_WINDS], l: { any: 4 },
        gear: ["Quarterstaff", "Dagger", "Robes", "Book, Magic", "Amulet"] },
      { id: "master-wizard", en: "Master Wizard", pl: "Mistrz magii", pre: ["Magister", "Magister"],
        d: ["Reality bends politely in this person's presence, and so does the city council.", "W obecności tej osoby rzeczywistość uprzejmie się ugina, a rada miejska tym bardziej."],
        c: { int: 10, wp: 15, i: 5 }, s: { "Language (Magick)": 15, "Lore (Magick)": 20, Leadership: 15, Cool: 15 }, sc: [{ adv: 20, of: WINDS }], t: ["War Wizard", "Magic Resistance", "Tower of Memories", "Instinctive Diction", "Suffused with Magic"], l: { any: 6 },
        gear: ["Quarterstaff", "Dagger", "Robes", "Book, Magic", "Amulet", "Jewellery"] }
    ]
  },
  {
    id: "priest", en: "Clergy", pl: "Duchowieństwo", icon: "icons/svg/holy-shield.svg",
    ranks: [
      { id: "novice", en: "Novice", pl: "Nowicjusz",
        d: ["Sweeps the temple floor and memorises the litanies by the hundred.", "Zamiata świątynię i uczy się litanii na pamięć, po setce naraz."],
        c: { wp: 5, fel: 5 }, s: { Pray: 10, "Lore (Theology)": 10, Cool: 5, Charm: 5 }, t: ["Read/Write"],
        gear: ["Robes", "Religious Symbol", "Book, Religion"] },
      { id: "priest", en: "Priest", pl: "Kapłan",
        d: ["Blesses the harvest, buries the dead and hears every secret in the parish.", "Błogosławi plony, grzebie zmarłych i zna wszystkie sekrety parafii."],
        c: { wp: 10, fel: 5, int: 5 }, s: { Pray: 15, "Lore (Theology)": 10, Charm: 10, Intuition: 10, Heal: 5 }, t: ["Holy Visions", "Etiquette (Cultists)"],
        tc: [["Bless (Sigmar)", "Bless (Ulric)", "Bless (Morr)", "Bless (Shallya)", "Bless (Myrmidia)", "Bless (Taal)", "Bless (Verena)", "Bless (Manann)", "Bless (Rhya)", "Bless (Ranald)"]],
        gear: ["Hand Weapon", "Robes", "Religious Symbol", "Book, Religion"] },
      { id: "warrior-priest", en: "Warrior Priest", pl: "Kapłan wojownik",
        d: ["Preaches with an open book in one hand and an open skull in the other.", "Naucza z otwartą księgą w jednej ręce i rozłupaną czaszką w drugiej."],
        c: { ws: 15, s: 5, t: 10, wp: 5 }, s: { "Melee (Basic)": 25, "Melee (Two-Handed)": 15, Pray: 10, Leadership: 10, Intimidate: 10 }, t: ["Holy Hatred", "Strike Mighty Blow", "Impassioned Zeal"],
        tc: [["Invoke (Sigmar)", "Invoke (Ulric)", "Invoke (Myrmidia)", "Invoke (Morr)", "Invoke (Taal)", "Invoke (Manann)"]],
        gear: [["Warhammer", "Hand Weapon"], "Shield", "Mail Coat", "Plate Breastplate", "Leather Skullcap", "Religious Symbol"] },
      { id: "high-priest", en: "High Priest", pl: "Arcykapłan", pre: ["Reverend", "Czcigodny"],
        d: ["Governs a great temple, its treasury and a good number of its enemies.", "Zarządza wielką świątynią, jej skarbcem i sporą częścią jej wrogów."],
        c: { i: 5, int: 10, wp: 15, fel: 10 }, s: { Pray: 25, Leadership: 25, "Lore (Theology)": 20, Charm: 15 }, t: ["Master Orator", "Inspiring", "Pure Soul", "Public Speaker"],
        gear: ["Hand Weapon", "Courtly Garb", "Religious Symbol", "Jewellery", "Book, Religion"] }
    ]
  }
];
