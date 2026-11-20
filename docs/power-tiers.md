# Tiery siły szablonów (Tier I–V)

Ocena siły wszystkich 188 szablonów w kompendium **WFRP4e: NPC Templates** według mechaniki WFRP4e (4. edycja). Tier mówi, **o ile groźniejszy w walce staje się aktor po nałożeniu szablonu**. Nie mówi, jak groźny jest gotowy aktor, bo to zależy od tego, na co szablon nałożysz. Siła społeczna, handlowa czy medyczna liczy się słabo, dlatego zawody niebojowe kończą na Tier II.

Szablony z folderu **Siła** (Mięso armatnie → Legenda) są celowo ułożone kolejno w Tier I–V i mogą służyć za punkt odniesienia.

## Kryteria

| Tier | Nazwa robocza | Co daje aktorowi | Typowe przykłady |
|---|---|---|---|
| **I** | Kosmetyka lub osłabienie | Bilans ujemny albo do ok. +10 w cechach bojowych, 1–2 talenty niebojowe, brak cech stworzeń, które zmieniają walkę. | Słabości, tła (Pochodzenie, Fach, Wiara), pierwsze stopnie zawodów cywilnych |
| **II** | Drobne wzmocnienie | Mniej więcej jeden poziom profesji: +10–20 w cechach, 2–3 talenty, albo jedna umiarkowana cecha stworzenia (Fast, Big, Brute, Armour 2, Venom, Fear 1, Ward 9). | Rekrut, Tarczownik, Silny, Olbrzymi, Akolita, Kapłan |
| **III** | Wyraźny skok | Aktor przechodzi o kategorię wyżej: +30–50 w cechach i kluczowe talenty bojowe (Strike Mighty Blow, Riposte, Frenzy), albo cecha, która zmienia przebieg walki (Breath, Armour 4, Petrifying Gaze, Regenerate), albo pełny zestaw czarów. | Elita, Czempion, Zabójca, Szaman, Nekromanta, Sierżant |
| **IV** | Przeciwnik dla całej drużyny | Kilka mocnych cech stworzeń naraz (Ward, Daemonic, Ethereal, Champion, Fear 2+, Undead) albo szczyt ludzkiej kariery bojowej lub magicznej (pełna płyta + Combat Master, 4+ czary tajemne). | Boss, Wódz, Kapitan, Czarodziej, Opętany przez demona, Szczytowy drapieżnik |
| **V** | Finał kampanii | Terror, Ward 8 lub lepszy, Regenerate i Die Hard na raz, ogromne premie do cech. Sam zagraża doświadczonej drużynie i trudno go zabić zwykłymi środkami. | Legenda, Nemezis, Nie do zabicia, Wcielona zagłada |

## Jak liczyłem

Każdy szablon dostał orientacyjne **punkty siły**, a potem przejrzałem wynik ręcznie:

- **Cechy:** +5 do WW lub S = 1 pkt, Wt = 1,2 pkt (dodaje Żywotność przez BWt ×2), US 0,8, I, Zw i SW 0,6, a Zr, Int i Ogd 0,2–0,3. Kary odejmują tyle samo.
- **Cechy stworzeń:** Armour 1,3 pkt za punkt, Fear 1,2 pkt za poziom, Terror 4 + 1,5 pkt za poziom, Ward 9/8/7/6 = 3/5/7/9 pkt, Daemonic jak Ward + 1, Regenerate 8, Ethereal 9, Elite 7, Big 6, Petrifying Gaze 6, Breath 6, Brute i Tough 4, Champion 4, Hardy 3,5, Undead 3, Painless 3, Die Hard 2, Fast 2,5. Wady liczą się na minus: Stupid i Skittish −3, Unstable −2.
- **Talenty:** bojowe 1–3 pkt (Combat Master 3, Arcane Magic i Invoke 3, Whirlwind of Death 2,5, Strike Mighty Blow, Riposte, Frenzy i Reaction Strike 2). Pozostałe 0,5 pkt.
- **Umiejętności:** 10 rozwinięć umiejętności bojowej lub magicznej (Broń, Unik, Opanowanie, Odporność, Splatanie, Modlitwa, Dowodzenie) = 0,5 pkt, a pozostałych 0,2 pkt.
- **Magia:** czar tajemny 1,5 pkt, czar prosty 0,4 pkt, stałe zaklęcie lub modlitwa 1 pkt.
- **Wyposażenie:** zbroja, tarcza i broń dwuręczna lub strzelecka 0,2–1 pkt za sztukę.
- **Ludzie:** stopnie archetypów sumują poprzednie, więc ocenione są w całości. Kapitan zawiera Rekruta, Weterana i Sierżanta.

Progi to I < 4, II 4–9, III 9–18, IV 18–34 i V ≥ 34 pkt. Korekty ręczne opisuje kolumna *Uzasadnienie*. Najczęściej obniżają zawody niebojowe i wysokie stopnie ludzi bez cech stworzeń, a podnoszą Ethereal, Breath, Armour 4 i Petrifying Gaze, które punkty niedoszacowują.

Tiery zapisuje `content/power-tiers.mjs` (klucz `grupa/id`), a `npm run packs` dopisuje je do nazw EN i PL. Zmiana tieru wymaga więc edycji tego pliku i przebudowania paczki. Nowy szablon bez tieru przerywa budowanie.

Nazwy cech stworzeń i talentów są systemowe (angielskie), tak jak w danych modułu. Skróty cech: WW, US, S, Wt, I, Zw, Zr, Int, SW, Ogd.

## Podsumowanie

| Tier | Liczba | Szablony |
|---|---:|---|
| **I** | 72 | Nocny stróż, Rabuś, Adept kultu, Traper, Majtek, Panicz, Domokrążca, Ulicznik, Zielarz, Nowicjusz, Dobosz, Podżegacz, Tropiciel, Znachor, Sabotażysta, Poganiacz bestii, Mięso armatnie, Rogaty, Pełzacz po ścianach, Przebiegły, Śliski, Czyhający, Bagienny, Ludojad, Terytorialny, Zepsuty rozpustnik, Tkacz intryg, Sługa wampira, Donosiciel szczuroludzi, Głupi, Chuchro, Tchórz, Pijak, Ranny, Zadżumiony, Jednooki, Wygłodzony, Obłąkany, Garbus, Wycieńczony, Przeklęty, Straszliwie okaleczony, Reiklandczyk, Middenheimczyk, Stirlandczyk, Nordlandczyk, Hochlandczyk, Kislevita, Tileańczyk, Bretończyk, Estalijczyk, Karczmarz, Chłop, Skryba, Woźnica, Służący, Żebrak, Kuglarz, Rybak, Wierny Sigmara, Wierny Ulryka, Wierny Shallyi, Wierny Morra, Wierny Ranalda, Donosiciel templariuszy, Skryty wątpiący, Bogaty mecenas, Lokalny bohater, Szpieg, Zhańbiony, Poszukiwany, Skorumpowany urzędnik |
| **II** | 59 | Rekrut, Strażnik miejski, Bandyta, Kultysta, Myśliwy, Przemytnik, Dworzanin, Handlarz, Kupiec, Mistrz cechu, Kieszonkowiec, Włamywacz, Cyrulik, Medyk, Doktor medycyny, Uczeń maga, Kapłan, Herszt, Chorąży, Taktyk, Akolita, Prorok, Tarczownik, Ochroniarz, Zabijaka, Harcownik, Zwiadowca, Truciciel, Jeździec, Oprawca, Stary wyga, Silny, Olbrzymi, Brutalny, Szybki, Zahartowany, Jadowity, Gruboskóry, Biczujący ogon, Skrzydlaty, Fanatyk, Wściekły, Eteryczna osłona, Pożeracz czarów, Naznaczony przez Chaos, Obżarty spaczeniem, Spaczony, Zaprzysiężony krwi, Pobłogosławiony zarazą, Wiedźma, Sługa nekromanty, Ożywiony, Grobowy chłód, Krwiopijca, Norsmen, Kowal, Górnik, Rzeźnik, Biczownik |
| **III** | 33 | Weteran, Sierżant, Sierżant straży, Kapitan straży, Rozbójnik, Zelota kultu, Przywódca kultu, Strażnik dróg, Łupieżca, Szyper, Pojedynkowicz, Wielmoża, Szef gangu, Czeladnik magii, Szaman, Nekromanta, Mroczny kapłan, Osiłek, Berserker, Czempion, Mistrz fechtunku, Strzelec, Zabójca, Elita, Żelaznoskóry, Ziejący ogniem, Ziejący mrozem, Ziejący trucizną, Ziejący burzą, Spojrzenie Kamienia, Znamię Rozkoszy, Znamię Przemiany, Ciało pomiotu |
| **IV** | 18 | Kapitan, Herszt bandy, Pogromca bestii, Czarodziej, Mistrz magii, Kapłan wojownik, Arcykapłan, Wódz, Czarownik, Boss, Szczytowy drapieżnik, Zmora magów, Prastary, Znamię Boga Krwi, Znamię Rozkładu, Opętany przez demona, Widmowy, Pan Kurhanu |
| **V** | 6 | Legenda, Nemezis, Nie do zabicia, Plaga prowincji, Wcielona zagłada, Niezniszczalny truposz |

## Poziom zagrożenia

| Szablon (EN / PL) | Grupa | Tier | Punkty | Uzasadnienie |
|---|---|:-:|---:|---|
| Cannon Fodder / Mięso armatnie | Siła | **I** | -4.8 | WW-10, US-10, SW-10 |
| Grizzled / Stary wyga | Siła | **II** | 3.5 | WW+5, Zw-5, SW+10 — *korekta: Siła: stopień II* |
| Elite / Elita | Siła | **III** | 11.5 | Elite; Combat Reflexes, Strike Mighty Blow |
| Boss / Boss | Siła | **IV** | 17.4 | WW+10, SW+10; Tough, Die Hard, Fear 1; Combat Reflexes, Strike Mighty Blow, Iron Will — *korekta: Siła: stopień IV – Die Hard, Tough i Fear 1 robią z niego przeciwnika na całą drużynę* |
| Legendary / Legenda | Siła | **V** | 55.1 | WW+20, S+15, Wt+20, I+15, SW+20; Champion, Hardy, Die Hard, Immunity to Psychology, Ward 8, Terror 2; Combat Master, Combat Reflexes, Strike Mighty Blow ×2, Strike to Injure, Whirlwind of Death |
| Apex Predator / Szczytowy drapieżnik | Zguba bohaterów | **IV** | 23.9 | WW+10, S+5, I+10; Elite, Fast, Fear 3; Strike Mighty Blow, Strike to Injure, Combat Reflexes |
| Nemesis / Nemezis | Zguba bohaterów | **V** | 37 | WW+15, SW+15; Champion, Elite, Tough, Die Hard, Hatred Heroes, Terror 1; Combat Master, Iron Will, Reaction Strike |
| Unkillable / Nie do zabicia | Zguba bohaterów | **V** | 37.2 | Wt+25, SW+15; Hardy, Regenerate, Die Hard, Ward 7, Armour 3; Implacable, Very Resilient |
| Scourge of the Province / Plaga prowincji | Zguba bohaterów | **V** | 34.6 | WW+15, S+10, Wt+15; Big, Brute, Belligerent, Terror 3; Strike Mighty Blow ×2 |
| Bane of Wizards / Zmora magów | Zguba bohaterów | **IV** | 21.7 | I+15, SW+25; Magic Resistance, Immunity to Psychology, Ward 8, Hatred Wizards; Magic Resistance ×2, Iron Will, Magic Defiance |
| Doom Incarnate / Wcielona zagłada | Zguba bohaterów | **V** | 111.4 | WW+30, US+15, S+25, Wt+30, I+20, Zw+10, SW+30; Champion, Elite, Big, Hardy, Regenerate, Die Hard, Magical, Immunity to Psychology, Ward 6, Armour 5, Terror 4; Combat Master, Combat Reflexes, Reaction Strike, Strike Mighty Blow ×3, Strike to Injure, Iron Will, Whirlwind of Death |

## Role

| Szablon (EN / PL) | Grupa | Tier | Punkty | Uzasadnienie |
|---|---|:-:|---:|---|
| Chieftain / Herszt | Dowódcy | **II** | 8 | WW+5; Leader, Fear 1; War Leader |
| Warlord / Wódz | Dowódcy | **IV** | 23.6 | WW+10, S+5, Wt+5, SW+10; Leader, Champion, Fear 2; War Leader, Combat Reflexes, Strike Mighty Blow |
| Standard Bearer / Chorąży | Dowódcy | **II** | 7.2 | Wt+5, SW+10 |
| Drummer / Dobosz | Dowódcy | **I** | 3.2 | I+5, SW+5 |
| Agitator / Podżegacz | Dowódcy | **I** | 3.8 | Ogd+10, Int+5 |
| Tactician / Taktyk | Dowódcy | **II** | 6.7 | I+10, Int+10; Cunning |
| Shaman / Szaman | Magia i wiara | **III** | 12.3 | Int+5, SW+10; Magical; Petty Magic; 6 stałe zaklęcia/modlitwy |
| Sorcerer / Czarownik | Magia i wiara | **IV** | 18.9 | Int+15, SW+15; Magical; Petty Magic, Arcane Magic (wybór); 5 czary tajemne, 3 proste — *korekta: 5 czarów tajemnych i 3 proste* |
| Acolyte / Akolita | Magia i wiara | **II** | 7 | Int+5, SW+5; Petty Magic; 4 stałe zaklęcia/modlitwy |
| Necromancer / Nekromanta | Magia i wiara | **III** | 15.1 | Int+10, SW+15, Ogd-5; Magical, Fear 1; Petty Magic; 6 stałe zaklęcia/modlitwy |
| Dark Priest / Mroczny kapłan | Magia i wiara | **III** | 13.8 | SW+15, Ogd+5; Magical, Fear 1, Corruption minor; Petty Magic; 4 stałe zaklęcia/modlitwy |
| Prophet / Prorok | Magia i wiara | **II** | 10.4 | SW+15, Ogd+10; Implacable; 3 stałe zaklęcia/modlitwy — *korekta: błogosławieństwa wspierają, sam nie walczy* |
| Thug / Osiłek | Pierwsza linia | **III** | 9.2 | S+15, Wt+10, Int-10, Ogd-5; Very Strong |
| Shield Bearer / Tarczownik | Pierwsza linia | **II** | 4.5 | Wt+5, SW+5; Shieldsman |
| Berserker / Berserker | Pierwsza linia | **III** | 10.6 | WW+5, S+10, Wt+5, Int-10; Frenzy, Berserk Charge |
| Champion / Czempion | Pierwsza linia | **III** | 9.9 | WW+10, SW+10; Champion; Combat Reflexes |
| Bodyguard / Ochroniarz | Pierwsza linia | **II** | 6.9 | WW+5, Wt+5, I+10 |
| Duelling Master / Mistrz fechtunku | Pierwsza linia | **III** | 11.1 | WW+15, Zw+10, I+5; Riposte |
| Brawler / Zabijaka | Pierwsza linia | **II** | 7.6 | S+5, Wt+5, I+5 |
| Sharpshooter / Strzelec | Dystans i zasadzka | **III** | 9.2 | US+15, I+5; Accurate Shot, Sure Shot, Marksman |
| Skirmisher / Harcownik | Dystans i zasadzka | **II** | 6 | US+5, I+5, Zw+10; Step Aside |
| Assassin / Zabójca | Dystans i zasadzka | **III** | 9.3 | WW+10, I+10, Zw+10; Strike to Injure, Careful Strike |
| Scout / Zwiadowca | Dystans i zasadzka | **II** | 4.2 | I+10, Zw+5 |
| Pathfinder / Tropiciel | Dystans i zasadzka | **I** | 3.8 | I+5, Zw+5 |
| Healer / Znachor | Wsparcie | **I** | 2.6 | Int+5, SW+5 |
| Poisoner / Truciciel | Wsparcie | **II** | 4.3 | Zr+10, Int+5; Venom 1 |
| Saboteur / Sabotażysta | Wsparcie | **I** | 2.7 | Zr+10, I+5 |
| Beastmaster / Poganiacz bestii | Wsparcie | **I** | 3.8 | SW+10, Ogd+5 |
| Rider / Jeździec | Wsparcie | **II** | 4.5 | WW+5, Zw+5, SW+5 |
| Torturer / Oprawca | Wsparcie | **II** | 6.5 | Zr+5, SW+10; Frightening |

## Cechy

| Szablon (EN / PL) | Grupa | Tier | Punkty | Uzasadnienie |
|---|---|:-:|---:|---|
| Mighty / Silny | Ciało | **II** | 5 | S+15; Strike Mighty Blow |
| Hulking / Olbrzymi | Ciało | **II** | 6 | Big |
| Brutish / Brutalny | Ciało | **II** | 4 | Brute |
| Swift / Szybki | Ciało | **II** | 2.5 | Fast — *korekta: Fast: +1 Szybkość, +10 Zw* |
| Hardened / Zahartowany | Ciało | **II** | 8 | Tough, Hardy |
| Ancient / Prastary | Ciało | **IV** | 18 | WW+15, Wt+15, SW+15, Zw-5; Hardy, Die Hard, Fear 2; Iron Will |
| Venomous / Jadowity | Ciało | **II** | 2 | Venom 1 — *korekta: Venom: stan Zatrucie przy trafieniu* |
| Thick-Hided / Gruboskóry | Ciało | **II** | 2.6 | Armour 2 — *korekta: Armour 2 na każdej lokacji* |
| Iron-Hided / Żelaznoskóry | Ciało | **III** | 4.6 | Zw-5; Armour 4 — *korekta: Armour 4 na każdej lokacji* |
| Horned / Rogaty | Ciało | **I** | 1.5 | Horns (Feature) 3 |
| Lashing Tail / Biczujący ogon | Ciało | **II** | 2.5 | Tail Attack 3 — *korekta: dodatkowy atak ogonem* |
| Winged / Skrzydlaty | Ciało | **II** | 3.6 | Zw+5; Flight 8 — *korekta: Flight 8* |
| Wall-Crawler / Pełzacz po ścianach | Ciało | **I** | 2.5 | Zw+5; Wallcrawler |
| Sly / Przebiegły | Natura | **I** | 2.5 | Cunning |
| Slippery / Śliski | Natura | **I** | 2.4 | S-5, I+10, Int+10, Ogd+5 |
| Fanatic / Fanatyk | Natura | **II** | 6.3 | WW+5, Int-5, SW+15, Ogd-10; Frenzy, Implacable |
| Rabid / Wściekły | Natura | **II** | 4.2 | S+5, SW+5, Int-10; Frenzy, Infected |
| Lurker / Czyhający | Natura | **I** | 3.3 | I+10; Stealthy |
| Marsh-Dweller / Bagienny | Natura | **I** | 2.6 | Wt+5; Swamp-strider, Amphibious |
| Man-Eater / Ludojad | Natura | **I** | 3.8 | S+5, WW+5; Hatred Humans |
| Territorial / Terytorialny | Natura | **I** | 2.6 | WW+5, SW+5; Belligerent |
| Fire-Breather / Ziejący ogniem | Moce | **III** | 6 | Breath 8 — *korekta: Breath 8: atak obszarowy* |
| Frost-Breather / Ziejący mrozem | Moce | **III** | 6 | Breath 8 — *korekta: Breath 8: atak obszarowy* |
| Poison-Breather / Ziejący trucizną | Moce | **III** | 5 | Breath 6 — *korekta: Breath 6: atak obszarowy* |
| Storm-Breather / Ziejący burzą | Moce | **III** | 6 | Breath 8 — *korekta: Breath 8: atak obszarowy* |
| Aethyric Ward / Eteryczna osłona | Moce | **II** | 5.2 | SW+10; Ward 9, Magical |
| Spell-Eater / Pożeracz czarów | Moce | **II** | 6.8 | SW+15; Magic Resistance; Magic Resistance, Magic Defiance |
| Stone-Gazer / Spojrzenie Kamienia | Moce | **III** | 8.4 | SW+10; Petrifying Gaze, Fear 1 — *korekta: Petrifying Gaze może wyłączyć postać* |
| Chaos-Marked / Naznaczony przez Chaos | Skażenie | **II** | 4.3 | S+5, Wt+5, SW+5; Corruption minor, Mutation |
| Mark of the Blood God / Znamię Boga Krwi | Skażenie | **IV** | 20.1 | WW+15, S+10, SW+10; Frenzy, Fear 2, Corruption moderate; Strike Mighty Blow, Furious Assault, Whirlwind of Death |
| Mark of Decay / Znamię Rozkładu | Skażenie | **IV** | 18.1 | Wt+20, Zw-10; Hardy, Regenerate, Infected, Corruption moderate |
| Mark of Excess / Znamię Rozkoszy | Skażenie | **III** | 11.2 | I+15, Zw+15, Ogd+15; Distracting, Fast, Corruption moderate |
| Mark of Change / Znamię Przemiany | Skażenie | **III** | 11.4 | I+10, Int+15, SW+15; Magical, Ward 9, Mutation, Corruption moderate; Tzeentch's Blessing |
| Warpstone-Gorged / Obżarty spaczeniem | Skażenie | **II** | 7 | S+10, Wt+10, Int-10; Mutation, Corruption major |
| Spawn-Flesh / Ciało pomiotu | Skażenie | **III** | 12.6 | Wt+10, Int-15, Ogd-20; Regenerate, Painless, Mutation |
| Daemon-Possessed / Opętany przez demona | Skażenie | **IV** | 19 | WW+10, S+5, SW+20; Daemonic 8, Fear 3, Magical, Corruption major |
| Tainted / Spaczony | Skażenie | **II** | 4.2 | Wt+10, SW-5, Ogd-15; Frightening |
| Blood-Sworn / Zaprzysiężony krwi | Skażenie | **II** | 7.7 | WW+10, S+5, Int-5, Ogd-10; Frenzy, Strike Mighty Blow |
| Plague-Blessed / Pobłogosławiony zarazą | Skażenie | **II** | 6.8 | Wt+15, Zw-10, Ogd-10; Hardy |
| Depraved Libertine / Zepsuty rozpustnik | Skażenie | **I** | 3.2 | Zw+5, Ogd+15, SW-5 |
| Web-Weaver / Tkacz intryg | Skażenie | **I** | 2.5 | I+5, Int+15, SW+5, S-5 |
| Vampire's Thrall / Sługa wampira | Skażenie | **I** | 1.5 | S+5, SW-10 |
| Ratman's Informant / Donosiciel szczuroludzi | Skażenie | **I** | 1.6 | I+5, SW-5 |
| Hedge Witch / Wiedźma | Skażenie | **II** | 4.5 | Int+5, SW+10, Ogd-5; Petty Magic; 3 proste |
| Necromancer's Servant / Sługa nekromanty | Skażenie | **II** | 4 | S+5, Wt+5, SW-5 |
| Risen / Ożywiony | Nieumarłość | **II** | 2.8 | Wt+5, I-15, Zw-10, Int-20, Ogd-30; Undead, Painless, Immunity to Psychology, Unstable, Fear 1 — *korekta: Undead, Painless, Immunity to Psychology, ale cechy spadają* |
| Grave-Chill / Grobowy chłód | Nieumarłość | **II** | 4.4 | SW+10; Chill Grasp, Fear 1 |
| Blood-Drinker / Krwiopijca | Nieumarłość | **II** | 5.5 | WW+5, S+5; Vampiric |
| Spectral / Widmowy | Nieumarłość | **IV** | 14.4 | Zw+10, SW+15, S-5; Ethereal, Magical, Fear 2 — *korekta: Ethereal: odporny na broń niemagiczną* |
| Barrow Lord / Pan Kurhanu | Nieumarłość | **IV** | 35.9 | WW+20, S+10, Wt+15, SW+20; Undead, Painless, Immunity to Psychology, Terror 2, Armour 2; War Leader, Strike Mighty Blow — *korekta: brak Ward i Regenerate; górna granica IV* |
| Deathless / Niezniszczalny truposz | Nieumarłość | **V** | 30.7 | Wt+20, SW+20; Undead, Regenerate, Die Hard, Ward 8, Terror 1 — *korekta: Undead, Regenerate, Ward 8, Die Hard: prawie nie do zabicia* |
| Dim-Witted / Głupi | Słabości | **I** | -5 | S+5, I-10, Int-15, SW-10; Stupid |
| Runt / Chuchro | Słabości | **I** | -9.4 | WW-10, S-10, Wt-10; Skittish |
| Coward / Tchórz | Słabości | **I** | 1.2 | Zw+10, SW-15 |
| Drunkard / Pijak | Słabości | **I** | 0.5 | WW-5, I-5, Zw-5, Zr-10, Wt+5 |
| Wounded / Ranny | Słabości | **I** | -5.6 | WW-5, S-5, Wt-10, Zw-10 |
| Plague-Ridden / Zadżumiony | Słabości | **I** | -4.5 | S-10, Wt-10, Ogd-10 |
| One-Eyed / Jednooki | Słabości | **I** | -2.4 | US-15, I-5 |
| Starving / Wygłodzony | Słabości | **I** | -5.6 | S-10, Wt-10, Zw-5, SW-5 |
| Unhinged / Obłąkany | Słabości | **I** | 1.4 | I+5, Int-10, SW+10, Ogd-15 |
| Hunchback / Garbus | Słabości | **I** | 1.5 | S+5, Wt+5, Zw-10, Ogd-10 |
| Exhausted / Wycieńczony | Słabości | **I** | -6.6 | WW-10, US-10, I-15, Zw-10 |
| Cursed / Przeklęty | Słabości | **I** | -0.6 | SW-5, Ogd-10 |
| Horribly Scarred / Straszliwie okaleczony | Słabości | **I** | 1.7 | Ogd-15, SW+5 |

## Ludzie – archetypy

| Szablon (EN / PL) | Grupa | Tier | Punkty | Uzasadnienie |
|---|---|:-:|---:|---|
| Recruit / Rekrut | Żołnierz (stopień 1) | **II** | 4.1 | WW+5, Wt+5 |
| Veteran / Weteran | Żołnierz (stopień 2) | **III** | 13.8 | WW+10, Wt+10, SW+5, I+5; Strike Mighty Blow; pancerz: Shield, Mail Shirt |
| Sergeant / Sierżant | Żołnierz (stopień 3) | **III** | 24 | WW+15, Wt+10, SW+10, I+5, Ogd+10; Strike Mighty Blow, Reaction Strike (wybór); pancerz: Shield, Mail Coat, Mail Coif, Plate Breastplate — *korekta: człowiek bez cech stworzeń* |
| Captain / Kapitan | Żołnierz (stopień 4) | **IV** | 39 | WW+25, Wt+10, SW+10, I+10, Ogd+15, Int+10; Strike Mighty Blow ×2, War Leader, Combat Master, Reaction Strike (wybór); pancerz: Shield, Plate Breastplate, Plate Helm, Mail Coat, Plate Leggings, Plate Bracers — *korekta: szczyt ludzkiej walki: pełna płyta, Combat Master* |
| Night Watchman / Nocny stróż | Straż miejska (stopień 1) | **I** | 2.8 | I+5, SW+5 |
| Watchman / Strażnik miejski | Straż miejska (stopień 2) | **II** | 8.2 | I+5, SW+5, WW+5, Ogd+5, Wt+5 |
| Watch Sergeant / Sierżant straży | Straż miejska (stopień 3) | **III** | 13.3 | I+5, SW+10, WW+10, Ogd+10, Wt+5, Int+5; pancerz: Mail Shirt |
| Watch Captain / Kapitan straży | Straż miejska (stopień 4) | **III** | 20.8 | I+5, SW+15, WW+15, Ogd+20, Wt+5, Int+10; pancerz: Mail Coat, Plate Breastplate, Plate Open Helm — *korekta: sporo umiejętności społecznych* |
| Footpad / Rabuś | Banita (stopień 1) | **I** | 2.7 | Zw+5, WW+5 |
| Bandit / Bandyta | Banita (stopień 2) | **II** | 9.6 | Zw+5, WW+10, US+5, Wt+5 — *korekta: drugi stopień* |
| Highwayman / Rozbójnik | Banita (stopień 3) | **III** | 15.6 | Zw+10, WW+15, US+5, Wt+5, Ogd+10 |
| Bandit Chief / Herszt bandy | Banita (stopień 4) | **IV** | 30.7 | Zw+10, WW+25, US+5, Wt+10, Ogd+10, S+5, SW+10; Combat Reflexes, Strike Mighty Blow, Furious Assault (wybór); pancerz: Shield, Mail Shirt |
| Cult Initiate / Adept kultu | Kultysta (stopień 1) | **I** | 2.1 | SW+5, Ogd+5 |
| Cultist / Kultysta | Kultysta (stopień 2) | **II** | 6.5 | SW+10, Ogd+5, I+5, WW+5 |
| Cult Zealot / Zelota kultu | Kultysta (stopień 3) | **III** | 18.2 | SW+20, I+5, WW+15, S+5, Wt+5; Frenzy, Implacable; pancerz: Shield — *korekta: człowiek z Frenzy, bez cech stworzeń* |
| Cult Leader / Przywódca kultu | Kultysta (stopień 4) | **III** | 21.6 | SW+25, Ogd+15, I+10, WW+10, S+5, Int+10; Frenzy, Implacable — *korekta: siła głównie społeczna* |
| Trapper / Traper | Łowca (stopień 1) | **I** | 2.2 | Zr+5, I+5 |
| Hunter / Myśliwy | Łowca (stopień 2) | **II** | 10.7 | Zr+5, I+5, US+10, Zw+5, Wt+5; Accurate Shot — *korekta: drugi stopień; jeden dobry łuk* |
| Road Warden / Strażnik dróg | Łowca (stopień 3) | **III** | 18.7 | Zr+5, I+5, US+15, Zw+5, Wt+5, WW+5, SW+5, Ogd+5; Accurate Shot; pancerz: Mail Shirt — *korekta: dobry żołnierz konny, bez cech stworzeń* |
| Beast Slayer / Pogromca bestii | Łowca (stopień 4) | **IV** | 33.5 | Zr+5, I+5, US+20, Zw+5, Wt+10, WW+15, SW+10, Ogd+5, S+5; Accurate Shot, Sharpshooter, Strike to Injure, Slayer; pancerz: Mail Coat |
| Deckhand / Majtek | Rzeka i morze (stopień 1) | **I** | 3.3 | S+5, Zw+5 |
| Smuggler / Przemytnik | Rzeka i morze (stopień 2) | **II** | 7.8 | S+5, Zw+10, Zr+5, Ogd+5, I+5 |
| Reaver / Łupieżca | Rzeka i morze (stopień 3) | **III** | 20.9 | S+10, Zw+10, Zr+5, Ogd+5, I+5, WW+10, Wt+5; Strike Mighty Blow, Furious Assault (wybór); pancerz: Shield (Buckler) — *korekta: człowiek bez cech stworzeń* |
| Ship's Captain / Szyper | Rzeka i morze (stopień 4) | **III** | 28.4 | S+10, Zw+10, Zr+5, Ogd+15, I+10, WW+10, Wt+5, Int+10, SW+5; Strike Mighty Blow, Furious Assault (wybór); pancerz: Mail Shirt — *korekta: walka dziedziczona ze Łupieżcy* |
| Scion / Panicz | Szlachta (stopień 1) | **I** | 2.3 | Ogd+5, Int+5 |
| Courtier / Dworzanin | Szlachta (stopień 2) | **II** | 6 | Ogd+15, Int+10, I+5 |
| Duellist / Pojedynkowicz | Szlachta (stopień 3) | **III** | 21.1 | Ogd+15, Int+10, I+15, WW+15, Zw+10, S-5; Riposte, Reaction Strike — *korekta: groźny w pojedynku, kruchy* |
| Noble Lord / Wielmoża | Szlachta (stopień 4) | **III** | 29.3 | Ogd+25, Int+15, I+15, WW+15, Zw+10, S-5, SW+10; Riposte, Reaction Strike; pancerz: Plate Breastplate, Mail Coat — *korekta: walka dziedziczona z Pojedynkowicza* |
| Peddler / Domokrążca | Handel (stopień 1) | **I** | 2.8 | Ogd+5, Wt+5 |
| Trader / Handlarz | Handel (stopień 2) | **II** | 5.5 | Ogd+10, Wt+5, Int+5 |
| Merchant / Kupiec | Handel (stopień 3) | **II** | 9.4 | Ogd+15, Wt+5, Int+10, SW+5 — *korekta: brak wzrostu w walce* |
| Guild Master / Mistrz cechu | Handel (stopień 4) | **II** | 15.3 | Ogd+25, Wt+5, Int+20, SW+5, I+5 — *korekta: brak wzrostu w walce* |
| Urchin / Ulicznik | Półświatek (stopień 1) | **I** | 1.5 | Zw+5, I+5, S-5 |
| Pickpocket / Kieszonkowiec | Półświatek (stopień 2) | **II** | 5.3 | Zw+10, I+5, S-5, Zr+15, Ogd+5 |
| Burglar / Włamywacz | Półświatek (stopień 3) | **II** | 11.1 | Zw+20, I+10, S-5, Zr+20, Ogd+5 — *korekta: zręczność, nie walka* |
| Gang Boss / Szef gangu | Półświatek (stopień 4) | **III** | 22.9 | Zw+20, I+10, S-5, Zr+20, Ogd+15, WW+10, Wt+5, SW+10, Int+5 — *korekta: siła głównie społeczna* |
| Herbalist / Zielarz | Medycyna (stopień 1) | **I** | 1.5 | Zr+5, Int+5 |
| Barber-Surgeon / Cyrulik | Medycyna (stopień 2) | **II** | 4.5 | Zr+15, Int+5, SW+5 |
| Physician / Medyk | Medycyna (stopień 3) | **II** | 8.6 | Zr+20, Int+15, SW+5, Ogd+5 |
| Master Physician / Doktor medycyny | Medycyna (stopień 4) | **II** | 13.9 | Zr+25, Int+25, SW+10, Ogd+10 — *korekta: brak wzrostu w walce* |
| Wizard's Apprentice / Uczeń maga | Magia (stopień 1) | **II** | 5.2 | Int+5, SW+5; Petty Magic; 3 proste |
| Journeyman Wizard / Czeladnik magii | Magia (stopień 2) | **III** | 18.3 | Int+10, SW+15, I+5; Petty Magic, Arcane Magic (wybór); 3 czary tajemne, 3 proste — *korekta: 3 czary tajemne* |
| Wizard / Czarodziej | Magia (stopień 3) | **IV** | 30.9 | Int+15, SW+25, I+5, Ogd+5; Petty Magic, Iron Will, Arcane Magic (wybór); 7 czary tajemne, 3 proste |
| Master Wizard / Mistrz magii | Magia (stopień 4) | **IV** | 52.4 | Int+25, SW+40, I+10, Ogd+5; Petty Magic, Iron Will, War Wizard, Magic Resistance, Arcane Magic (wybór); 13 czary tajemne, 3 proste — *korekta: górna granica IV: ok. 13 czarów, ale kruchy* |
| Novice / Nowicjusz | Duchowieństwo (stopień 1) | **I** | 2.5 | SW+5, Ogd+5 |
| Priest / Kapłan | Duchowieństwo (stopień 2) | **II** | 8.1 | SW+15, Ogd+10, Int+5; Bless (wybór) |
| Warrior Priest / Kapłan wojownik | Duchowieństwo (stopień 3) | **IV** | 29.8 | SW+20, Ogd+10, Int+5, WW+15, S+5, Wt+10; Holy Hatred, Strike Mighty Blow, Bless (wybór), Invoke (wybór); pancerz: Shield, Mail Coat, Plate Breastplate |
| High Priest / Arcykapłan | Duchowieństwo (stopień 4) | **IV** | 35.7 | SW+35, Ogd+20, Int+15, WW+15, S+5, Wt+10, I+5; Holy Hatred, Strike Mighty Blow, Bless (wybór), Invoke (wybór) — *korekta: zawiera Kapłana wojownika* |

## Ludzie – tło

| Szablon (EN / PL) | Grupa | Tier | Punkty | Uzasadnienie |
|---|---|:-:|---:|---|
| Reiklander / Reiklandczyk | Pochodzenie | **I** | 0.8 | Ogd+5 |
| Middenheimer / Middenheimczyk | Pochodzenie | **I** | 3.3 | Wt+5, SW+5 |
| Stirlander / Stirlandczyk | Pochodzenie | **I** | 1.4 | SW+5, Ogd-5 |
| Nordlander / Nordlandczyk | Pochodzenie | **I** | 2.8 | Wt+5, Zw+5 |
| Hochlander / Hochlandczyk | Pochodzenie | **I** | 2.9 | US+10 |
| Kislevite / Kislevita | Pochodzenie | **I** | 3.2 | Wt+5, SW+5 |
| Tilean / Tileańczyk | Pochodzenie | **I** | 2.3 | I+5, Ogd+5 |
| Bretonnian / Bretończyk | Pochodzenie | **I** | 2.1 | Ogd+5, SW+5 |
| Estalian / Estalijczyk | Pochodzenie | **I** | 2.9 | Zw+5, Ogd+5 |
| Norscan / Norsmen | Pochodzenie | **II** | 4.6 | S+10, Wt+5, Ogd-5 |
| Innkeeper / Karczmarz | Fach | **I** | 1.5 | Ogd+5 |
| Blacksmith / Kowal | Fach | **II** | 5.1 | S+10, Wt+5 |
| Farmer / Chłop | Fach | **I** | 3.6 | S+5, Wt+5 |
| Scribe / Skryba | Fach | **I** | 1 | Int+10, S-5 |
| Miner / Górnik | Fach | **II** | 5.5 | S+5, Wt+10 |
| Coachman / Woźnica | Fach | **I** | 2.5 | I+5, SW+5 |
| Servant / Służący | Fach | **I** | 1.6 | I+5 |
| Beggar / Żebrak | Fach | **I** | 0.7 | Wt-5, Ogd+5 |
| Entertainer / Kuglarz | Fach | **I** | 2.5 | Zw+5, Ogd+10 |
| Butcher / Rzeźnik | Fach | **II** | 4.3 | S+5, SW+5; Strike to Injure |
| Fisher / Rybak | Fach | **I** | 2.5 | Zr+5, Wt+5 |
| Sigmar's Faithful / Wierny Sigmara | Wiara | **I** | 2.3 | SW+10 |
| Ulric's Faithful / Wierny Ulryka | Wiara | **I** | 3.7 | S+5, Wt+5, Ogd-5 |
| Shallya's Faithful / Wierny Shallyi | Wiara | **I** | 1 | Ogd+10, WW-5 |
| Morr's Faithful / Wierny Morra | Wiara | **I** | 3 | SW+10 |
| Ranald's Faithful / Wierny Ranalda | Wiara | **I** | 2.1 | Zr+5, Ogd+5 |
| Flagellant / Biczownik | Wiara | **II** | 7.7 | Wt+5, SW+15, Ogd-15, Int-5; Frenzy, Implacable |
| Templar's Informer / Donosiciel templariuszy | Wiara | **I** | 3.1 | I+5, Int+5, SW+5 |
| Secret Doubter / Skryty wątpiący | Wiara | **I** | 1.6 | Int+5, Ogd+5 |
| Wealthy Patron / Bogaty mecenas | Pozycja | **I** | 1.4 | Ogd+10, S-5 |
| Local Hero / Lokalny bohater | Pozycja | **I** | 3.6 | SW+5, Ogd+10 |
| Spy / Szpieg | Pozycja | **I** | 3.4 | I+5, Int+5, Ogd+5 |
| Disgraced / Zhańbiony | Pozycja | **I** | 0.9 | SW-5, Ogd-10, WW+5 |
| Wanted / Poszukiwany | Pozycja | **I** | 2.8 | I+5, Zw+5, Ogd-5 |
| Corrupt Official / Skorumpowany urzędnik | Pozycja | **I** | 2.3 | Int+5, Ogd+5 |
