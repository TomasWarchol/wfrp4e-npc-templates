# WFRP4e – NPC Templates (`wfrp4e-npc-templates`)

[English](README.md) | **Polski**

Gotowe szablony do WFRP4e: przeciągasz stopień albo nakładkę na aktora, a ten dostaje nowe cechy, umiejętności, talenty i wyposażenie.

Wymaga **Foundry VTT v14**, systemu **WFRP4e** w wersji **10.0+** i modułu **WFRP4e Core Rulebook**, z którego pochodzą talenty, umiejętności i wyposażenie. Polskie nazwy wymagają modułu **Babele** i polskiego tłumaczenia systemu.

## Co jest w środku

Kompendium **WFRP4e: NPC Templates** zawiera 172 szablony w dwóch kategoriach.

**Ludzie**

- **12 archetypów po 4 stopnie.** Żołnierz (Rekrut, Weteran, Sierżant, Kapitan), Straż miejska, Banita, Kultysta, Łowca, Rzeka i morze, Szlachta, Handel, Półświatek, Medycyna, Magia i Duchowieństwo.
- **11 nakładek do łączenia z czymkolwiek.** Żółtodziób, Stary wyga, Elita, Osiłek, Spryciarz, Fanatyk, Tchórz, Pijak, Ranny, Spaczony i Ochroniarz.
- **59 nakładek tematycznych.** Pochodzenie, Fach, Szkoła walki, Wiara, Przypadłości, Mroczne konszachty i Pozycja.

**Potwory i ulepszenia** (54 ulepszenia, działają też na ludziach)

- **Tężyzna.** Silny, Olbrzymi, Elitarny, Czempion, Przewodnik stada, Głupi, Prastary i inne.
- **Dzika natura.** Jadowity, Wściekły, Żelaznoskóry, Skrzydlaty, Ludojad i inne.
- **Dotyk Chaosu.** Naznaczony przez Chaos, cztery Znamiona, Obżarty spaczeniem, Opętany przez demona i inne.
- **Nieumarli.** Ożywiony, Widmowy, Pan Kurhanu, Niezniszczalny truposz i inne.
- **Dary magii.** Zionięcie, Eteryczna osłona, Pożeracz czarów, Czarnoksięski i inne.
- **Zguba bohaterów.** Najmocniejsze opcje dla wymagających drużyn, aż po Wcieloną zagładę.

## Jak używać

Przeciągnij szablon na postać, NPC albo stwora. Szablon zmienia cechy oraz dodaje umiejętności, talenty i wyposażenie. Niektóre stopnie proszą o wybór talentu lub broni, czarodzieje wybierają czary, a część stopni dopisuje do imienia tytuł, np. „Sierżant”.

Szablony korzystają z systemowego typu Template, więc widać je w sekcji **Applied Templates** na zakładce notatek. Usunięcie szablonu cofa jego działanie. Umiejętność, którą aktor już ma, dostaje dodatkowe rozwinięcia zamiast pojawić się drugi raz. Cecha, którą aktor już ma, rośnie do wyższej wartości, a Pancerz się sumuje. Po usunięciu szablonu wszystko wraca do stanu poprzedniego.

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
