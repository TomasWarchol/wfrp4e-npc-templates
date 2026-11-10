# WFRP4e – NPC Templates (`wfrp4e-npc-templates`)

[English](README.md) | **Polski**

Gotowe szablony do WFRP4e: przeciągasz stopień albo nakładkę na aktora, a ten dostaje nowe cechy, umiejętności, talenty i wyposażenie.

Wymaga **Foundry VTT v14**, systemu **WFRP4e** w wersji **10.0+** i modułu **WFRP4e Core Rulebook**, z którego pochodzą talenty, umiejętności i wyposażenie. Polskie nazwy wymagają modułu **Babele** i polskiego tłumaczenia systemu.

## Co jest w środku

Kompendium **WFRP4e: NPC Templates** służy do szybkiego robienia przeciwników. Przeciągasz szablony na dowolnego aktora i łączysz je: Goblin + Szaman to szaman goblinów, a Goblin + Wódz + Elita to ten, który tu rządzi.

| Folder | Pytanie | Ile nakładać |
|---|---|---|
| **Role** (30) | Kim jest w grupie? | jedną |
| **Poziom zagrożenia** (11) | Jak jest groźny? | jeden, a dla prawdziwego bossa także Zgubę bohaterów |
| **Cechy** (64) | Co ma w sobie szczególnego? | dowolnie |
| **Ludzie** (83) | Potrzebujesz gotowego człowieka od zera? | jeden stopień i dowolne tło |

**Role** działają na każdej rasie i dopisują się do imienia, np. „Goblin (Szaman)”.

- **Dowódcy:** Herszt, Wódz, Chorąży, Dobosz, Podżegacz, Taktyk
- **Magia i wiara:** Szaman, Czarownik, Akolita, Nekromanta, Mroczny kapłan, Prorok
- **Pierwsza linia:** Osiłek, Tarczownik, Berserker, Czempion, Ochroniarz, Mistrz fechtunku, Zabijaka
- **Dystans i zasadzka:** Strzelec, Harcownik, Zabójca, Zwiadowca, Tropiciel
- **Wsparcie:** Znachor, Truciciel, Sabotażysta, Poganiacz bestii, Jeździec, Oprawca

Rzucający czary dostają stały zestaw zapamiętanych zaklęć, bez okien wyboru. Czarownik pyta o tradycję.

**Poziom zagrożenia:** Mięso armatnie, Weteran, Elita, Boss, Legenda i sześć bardzo mocnych szablonów Zguby bohaterów.

**Cechy:** Ciało, Natura, Moce, Skażenie, Nieumarłość i Słabości.

**Ludzie:** 12 archetypów po 4 stopnie oraz Pochodzenie, Fach, Wiara i Pozycja jako tło.

Pozycje, których nie ma w aktywnych kompendiach, są pomijane, a komunikat podaje, czego zabrakło. Talenty z dodatków są opcjonalne, więc pomijają się bez komunikatu.

Każdy stopień zawiera już niższe, więc nakładaj na aktora jeden stopień.

## Jak używać

Przeciągnij szablon na postać, NPC albo stwora. Szablon zmienia cechy oraz dodaje umiejętności, talenty i wyposażenie. Niektóre stopnie proszą o wybór talentu lub broni, czarodzieje wybierają czary, a część stopni dopisuje do imienia tytuł, np. „Sierżant”.

Szablony korzystają z systemowego typu Template, więc widać je w sekcji **Applied Templates** na zakładce notatek. Usunięcie szablonu cofa jego działanie. Umiejętność, którą aktor już ma, dostaje dodatkowe rozwinięcia zamiast pojawić się drugi raz. Cecha, którą aktor już ma, rośnie do wyższej wartości, a Pancerz się sumuje. Po usunięciu szablonu wszystko wraca do stanu poprzedniego.

Pozycje, których nie ma w aktywnych kompendiach, są pomijane, a komunikat podaje, czego zabrakło. Talenty z dodatków są opcjonalne, więc pomijają się bez komunikatu.

Każdy stopień zawiera już niższe, więc nakładaj na aktora jeden stopień i dowolne nakładki.

Interfejs działa w języku Foundry: **angielski** i **polski** są wbudowane, a kolejne języki można dodać (zobacz *Języki*); to, czego nie przetłumaczono, pokazuje się po angielsku.

## 📥 Instalacja

Wklej w *Manifest URL* w **Add-on Modules → Install Module**:

```
https://github.com/TomasWarchol/wfrp4e-npc-templates/releases/latest/download/module.json
```

## 🌐 Języki

Angielski i polski są wbudowane. Aby dodać kolejny język:

```bash
npm run lang:add -- de "Deutsch"
```

Polecenie tworzy `lang/de.json` (kopię tekstów angielskich) i dopisuje go do `module.json`. Przetłumacz teksty; każdy pominięty klucz pokaże się po angielsku, a `npm run check` wypisze nieprzetłumaczone klucze. Tłumaczenia mile widziane jako pull requesty.

Osobny moduł tłumaczenia może też dodać język bez zmian w tym module: deklaruje wpis `languages` z `"lang": "de"`, wskazujący na własny plik z tymi samymi kluczami.

Nazwy i opisy szablonów tłumaczy [Babele](https://foundryvtt.com/packages/babele). Skopiuj `compendium/pl` do `compendium/<kod>`, przetłumacz i dopisz kod do `COMPENDIUM_LANGUAGES` w `scripts/main.mjs`. Nazwy talentów i umiejętności dopasowują się do przetłumaczonego kompendium same. Specjalizacje, np. „Żołnierze”, pochodzą z sekcji `Specialisations` pliku językowego.

## 🛠️ Rozwój

```bash
npm install
npm run check   # manifest + tłumaczenia, lint, testy
npm run packs   # buduje kompendium i polskie tłumaczenie z content/templates.mjs
npm run link    # podłącza ten katalog do lokalnego Foundry (Data/modules)
```

## 📄 Licencja

MIT – zobacz [LICENSE](LICENSE).

Nieoficjalna twórczość fanowska, niezwiązana z Games Workshop ani Cubicle 7 i przez nie niepopierana. Warhammer i powiązane nazwy są znakami towarowymi Games Workshop Limited. Moduł nie zawiera tekstów ani grafik z podręczników – działa z treściami, które już posiadasz.
