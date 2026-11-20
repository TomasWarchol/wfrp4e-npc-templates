import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HINTS } from "../content/hints.mjs";
import { POWER_TIERS } from "../content/power-tiers.mjs";
import { ARCHETYPES } from "../content/templates.mjs";
import { ADDON_TALENTS } from "../content/addon-talents.mjs";
import { HUMAN_GROUPS } from "../content/human-overlays.mjs";
import { ROLE_GROUPS } from "../content/roles.mjs";
import { TIER_GROUPS } from "../content/tiers.mjs";
import { TRAIT_GROUPS } from "../content/traits.mjs";
import { accumulateRank, buildAll, buildSpellLinks, buildTraits, buildTrappings, stableId, tierSuffix } from "../tools/pack-builder.mjs";
import { buildAvailability, buildNameMap, isAvailable, resolveName } from "../scripts/names.mjs";
import { affixesFor, describeTemplate, filterTemplates, projectCharacteristics, projectSkills, romanTier, stripTier, summarizeStack, uniqueTargets } from "../scripts/forge-model.mjs";
import { BLESS_SCRIPT, blessingsFor, deityInName, deityOptions, needsDeityChoice, withDeity, withoutBlessScript } from "../scripts/deity.mjs";
import { ARCANE_LORES, arcaneOptions, loreOptions, loreProfile, loreSpecialisation, needsLoreChoice, withLore } from "../scripts/lore.mjs";
import { grantedItemData, keepAvailable, localizedSystem, pruneChoices, splitOwnedSkills, revertUpdate, splitOwnedTraits, stackUpdate, stripAffixes, templateUpdate, traitValue, woundsAfterTemplate } from "../scripts/apply.mjs";
import { addRating, combineCharacteristics, combineValues, missingTalents, readStack, removeRating, stackedValue, talentRequirements, talentsToRestore } from "../scripts/stacking.mjs";

const coreItems = JSON.parse(readFileSync(new URL("../content/core-items.json", import.meta.url), "utf8"));
const coreTraits = JSON.parse(readFileSync(new URL("../content/core-traits.json", import.meta.url), "utf8"));
const built = buildAll({ archetypes: ARCHETYPES, humanGroups: HUMAN_GROUPS, roleGroups: ROLE_GROUPS, tierGroups: TIER_GROUPS, traitGroups: TRAIT_GROUPS, powerTiers: POWER_TIERS, hints: HINTS, coreItems, coreTraits, addonTalents: ADDON_TALENTS });
// Nazwy w kompendium mają dopisek tieru, np. "Boss (Tier IV)"; testy szukają po nazwie bazowej
const baseName = (name) => name.replace(/ \(Tier [IV]+\)$/, "");
const LABELS = { petty: "Magia Prosta", fire: "Ogień", heavens: "Niebiosa", metal: "Metal", beasts: "Bestie", life: "Życie", light: "Światło", death: "Śmierć", shadow: "Cień", necromancy: "Nekromancja", undivided: "Niepodzielony Chaos", greatMaw: "Wielka Paszcza", tzeentch: "Tzeentch" };
const byName = (name) => built.items.find((item) => baseName(item.name) === name);

describe("zestaw szablonów", () => {
  it("dopisuje tier siły do nazwy EN i PL każdego szablonu", () => {
    expect(Object.keys(POWER_TIERS)).toHaveLength(built.items.length);
    for (const item of built.items) {
      expect(item.name).toMatch(/ \(Tier (I|II|III|IV|V)\)$/);
      expect(built.translation.entries[item.name].name.endsWith(item.name.match(/ \(Tier .+\)$/)[0]), item.name).toBe(true);
    }
    expect(byName("Cannon Fodder").name).toBe("Cannon Fodder (Tier I)");
    expect(byName("Legendary").name).toBe("Legendary (Tier V)");
    expect(built.translation.entries["Boss (Tier IV)"].name).toBe("Boss (Tier IV)");
    expect(tierSuffix(3)).toBe(" (Tier III)");
  });

  it("odrzuca szablon bez tieru i tier bez szablonu", () => {
    const base = { archetypes: ARCHETYPES, humanGroups: HUMAN_GROUPS, roleGroups: ROLE_GROUPS, tierGroups: TIER_GROUPS, traitGroups: TRAIT_GROUPS, hints: HINTS, coreItems, coreTraits };
    const missing = { ...POWER_TIERS };
    delete missing["soldier/recruit"];
    expect(() => buildAll({ ...base, powerTiers: missing })).toThrow(/soldier\/recruit/);
    expect(() => buildAll({ ...base, powerTiers: { ...POWER_TIERS, "soldier/nope": 2 } })).toThrow(/soldier\/nope/);
  });

  it("daje stałe i poprawne identyfikatory", () => {
    expect(stableId("a")).toBe(stableId("a"));
    expect(new Set(built.items.map((i) => i._id)).size).toBe(built.items.length);
    for (const doc of [...built.items, ...built.folders]) expect(doc._id).toMatch(/^[a-zA-Z0-9]{16}$/);
  });

  it("wyższy stopień sumuje poprzednie", () => {
    const ranks = ARCHETYPES.find((a) => a.id === "soldier").ranks;
    expect(accumulateRank(ranks, 2).c.ws).toBe(15);
    const sergeant = byName("Sergeant");
    expect(sergeant.system.characteristics.ws).toBe(15);
    expect(sergeant.system.skills.list.find((s) => s.name === "Melee (Basic)").advances).toBe(20);
    expect(sergeant.system.alterName.pre).toBe("Sergeant");
  });

  it("wybór Wiatru sumuje się między stopniami i pyta raz", () => {
    const winds = byName("Master Wizard").system.skills.list.filter((s) => s.group === 1);
    expect(winds).toHaveLength(8);
    expect(winds[0].advances).toBe(60);
  });

  it("nie używa nazw, dla których system otwiera własne okno specjalizacji", () => {
    for (const item of built.items) {
      for (const skill of item.system.skills.list) {
        expect(["Channelling", "Perform"], item.name).not.toContain(skill.name);
      }
    }
  });

  it("powtórzony talent liczy się jako kolejne wykupienie", () => {
    const captain = byName("Captain");
    expect(captain.system.talents.list.find((t) => t.name === "Strike Mighty Blow").advances).toBe(2);
  });

  it("wybór talentu ma wspólną grupę", () => {
    const group = byName("Sergeant").system.talents.list.filter((t) => t.group === 1);
    expect(group.map((t) => t.name)).toEqual(["Reaction Strike", "Strike to Stun", "Shieldsman"]);
  });

  it("buduje wyposażenie z wyborem i ilością", () => {
    const result = buildTrappings([["Hand Weapon", "Spear"], "Arrow*12"], coreItems, "test");
    expect(result.structure.type).toBe("and");
    expect(result.structure.options[0].type).toBe("or");
    expect(result.structure.options[0].options).toHaveLength(2);
    expect(result.options.find((o) => o.name === "Arrow").diff.system.quantity.value).toBe(12);
    expect(result.options[0].documentId).toMatch(/^Compendium\.wfrp4e-core\.items\.Item\./);
  });

  it("oznacza talenty z dodatków jako opcjonalne", () => {
    expect(byName("Ship's Captain").flags["wfrp4e-npc-templates"].optional).toEqual(["Chanty", "Master and Commander"]);
    expect(byName("Wizard").flags["wfrp4e-npc-templates"].optional).toHaveLength(8);
    expect(byName("Recruit").flags["wfrp4e-npc-templates"].optional).toEqual([]);
  });

  it("używa każdego talentu z listy dodatków", () => {
    const used = new Set(built.items.flatMap((item) => item.system.talents.list.map((talent) => talent.name)));
    for (const talent of ADDON_TALENTS) expect(used.has(talent), talent).toBe(true);
  });

  it("układa foldery w czterech kategoriach, od najczęściej używanych", () => {
    const top = built.folders.filter((f) => !f.folder).sort((a, b) => a.sort - b.sort).map((f) => f.name);
    expect(top).toEqual(["Roles", "Threat Level", "Traits", "People"]);
    const tiers = built.folders.find((f) => f.name === "Threat Level");
    expect(built.folders.filter((f) => f.folder === tiers._id).map((f) => f.name)).toContain("Bane of Heroes");
  });

  it("rola dopisuje się do imienia, a poziom i cecha nie", () => {
    const shaman = byName("Shaman");
    expect(shaman.system.alterName).toEqual({ pre: "", post: "(Shaman)" });
    expect(built.translation.entries[shaman.name].post).toBe("(Szaman)");
    expect(built.translation.mapping.post).toBe("system.alterName.post");
    expect(byName("Elite").system.alterName.post).toBe("");
    expect(byName("Mighty").system.alterName.post).toBe("");
  });

  it("każda rola ma dopisek w obu językach i działa bez rasy", () => {
    for (const group of ROLE_GROUPS) {
      for (const item of group.items) {
        expect(item.post, item.en).toHaveLength(2);
        expect(item.post[0], item.en).toMatch(/^\(.+\)$/);
        expect(item.post[1], item.en).toMatch(/^\(.+\)$/);
      }
    }
  });

  it("stałe zaklęcia są odwołaniami do kompendium i nie otwierają wyboru", () => {
    const shaman = byName("Shaman");
    const links = shaman.flags["wfrp4e-npc-templates"].spells;
    expect(links).toHaveLength(6);
    expect(links[0]).toMatch(/^Compendium\.wfrp4e-core\.items\.Item\./);
    expect(shaman.system.trappings.options).toEqual([]);
    expect(shaman.system.lores.list).toEqual([]);
    expect(byName("Prophet").flags["wfrp4e-npc-templates"].spells).toHaveLength(3);
    expect(byName("Thug").flags["wfrp4e-npc-templates"].spells).toEqual([]);
    expect(() => buildSpellLinks(["Nope"], coreItems, "test")).toThrow(/Nope/);
  });

  it("zaklęcia dostają znacznik szablonu, a zapamiętanie tylko zaklęcia", () => {
    globalThis.foundry = { utils: { mergeObject: (a, b) => {
      const out = structuredClone(a);
      for (const [path, value] of Object.entries(b)) {
        const keys = path.split(".");
        let node = out;
        for (const key of keys.slice(0, -1)) node = node[key] ??= {};
        node[keys.at(-1)] = value;
      }
      return out;
    } } };
    globalThis.game = { system: { id: "wfrp4e" } };
    const [spell, prayer] = grantedItemData([{ _id: "a", type: "spell", system: { memorized: { value: false } } }, { _id: "b", type: "prayer", system: {} }], "tpl");
    expect(spell._id).toBeUndefined();
    expect(spell.system.memorized.value).toBe(true);
    expect(spell.flags.wfrp4e.fromTemplate).toBe("tpl");
    expect(prayer.system.memorized).toBeUndefined();
    expect(prayer.flags.wfrp4e.fromTemplate).toBe("tpl");
    delete globalThis.foundry;
    delete globalThis.game;
  });

  it("Czarownik pyta o tradycję", () => {
    expect(byName("Sorcerer").system.lores.list.map((l) => l.name)).toEqual(["petty", "*"]);
  });

  it("role i poziomy nie dublują się z cechami", () => {
    const roles = new Set(ROLE_GROUPS.flatMap((g) => g.items.map((i) => i.id)));
    for (const group of [...TIER_GROUPS, ...TRAIT_GROUPS]) {
      for (const item of group.items) expect(roles.has(item.id), item.id).toBe(false);
    }
    expect(built.items.filter((i) => baseName(i.name) === "Elite")).toHaveLength(1);
    expect(byName("Elite Specimen")).toBeUndefined();
    expect(byName("Champion").system.traits.list.map((t) => t.name)).toContain("Champion");
  });

  it("zapisuje wartość cechy tak, by system o nią nie pytał", () => {
    const [armour, fire] = buildTraits([["Armour", 3], ["Breath", 8, { breath: "fire" }]], coreTraits, "test");
    expect(armour.diff.system.specification.value).toBe("3");
    expect(fire.diff.flags.wfrp4e.breath).toBe("fire");
    expect(() => buildTraits(["Nope"], coreTraits, "test")).toThrow(/Nope/);
  });

  it("odrzuca nieznany przedmiot", () => {
    expect(() => buildTrappings(["Excalibur"], coreItems, "test")).toThrow(/Excalibur/);
  });

  it("ma pełne polskie tłumaczenie każdego szablonu i folderu", () => {
    for (const item of built.items) {
      const entry = built.translation.entries[item.name];
      expect(entry.name, item.name).toBeTruthy();
      expect(entry.description, item.name).toMatch(/^<p>.+<\/p>$/);
      if (item.system.alterName.pre) expect(entry.pre, item.name).toBeTruthy();
    }
    for (const folder of built.folders) expect(built.translation.folders[folder.name], folder.name).toBeTruthy();
  });

  it("zawiera każdą specjalizację użytą w szablonach w obu plikach językowych", () => {
    const load = (code) => JSON.parse(readFileSync(new URL(`../lang/${code}.json`, import.meta.url), "utf8")).WFRP4E_TEMPLATES.Specialisations;
    const [en, pl] = [load("en"), load("pl")];
    const exact = /^(Melee|Ranged|Stealth|Ride|Sail|Language|Secret Signs|Channelling|Perform|Entertain) \(|^Lore \((Magick|Theology|Law|Heraldry|Geology)\)|^Trade \((Apothecary|Smith)\)/;
    for (const item of built.items) {
      for (const { name } of [...item.system.skills.list, ...item.system.talents.list]) {
        const spec = name.match(/\((.*)\)/)?.[1];
        if (spec && !exact.test(name)) {
          expect(en[spec], name).toBeTruthy();
          expect(pl[spec], name).toBeTruthy();
        }
      }
    }
  });
});

describe("nazwy w aktywnym tłumaczeniu", () => {
  const map = buildNameMap([
    { name: "Broń Biała (Podstawowa)", originalName: "Melee (Basic)" },
    { name: "Etykieta (Grupa Społeczna)", flags: { babele: { originalName: "Etiquette" } } },
    { name: "Cool" }
  ]);
  const polish = { Soldiers: "Żołnierze" };

  it("znajduje nazwę dokładną", () => {
    expect(resolveName("Melee (Basic)", map)).toBe("Broń Biała (Podstawowa)");
    expect(resolveName("Cool", map)).toBe("Cool");
  });

  it("składa specjalizację z tłumaczonej podstawy", () => {
    expect(resolveName("Etiquette (Soldiers)", map, (s) => polish[s] ?? s)).toBe("Etykieta (Żołnierze)");
  });

  it("zostawia nieznaną nazwę", () => {
    expect(resolveName("Unknown (X)", map)).toBe("Unknown (X)");
  });

  it("zostawia systemowi tylko umiejętności, których aktor nie ma", () => {
    const list = [{ name: "Cool", advances: 5 }, { name: "Dodge", advances: 5 }, { name: "Cool", advances: 5, group: 1 }];
    const { keep, merge } = splitOwnedSkills(list, new Set(["Cool"]));
    expect(merge).toEqual([{ name: "Cool", advances: 5 }]);
    expect(keep.map((s) => s.name)).toEqual(["Dodge", "Cool"]);
  });

  it("łączy cechy, które aktor już ma", () => {
    const spec = (value) => ({ system: { specification: { value } } });
    const list = [{ name: "Pancerz", diff: spec("2") }, { name: "Strach", diff: spec("1") }, { name: "Groza", diff: spec("3") }, { name: "Szał", diff: {} }, { name: "Nowa", diff: {} }];
    const owned = [{ name: "Pancerz", value: "3" }, { name: "Strach", value: "2" }, { name: "Groza", value: "1" }, { name: "Szał", value: "" }];
    const { keep, raise } = splitOwnedTraits(list, owned);
    expect(keep.map((t) => t.name)).toEqual(["Nowa"]);
    // Cecha bez wartości liczbowej też trafia do łączenia, żeby było wiadomo, który szablon jej potrzebuje
    expect(raise).toEqual([{ name: "Pancerz", rating: 2 }, { name: "Strach", rating: 1 }, { name: "Groza", rating: 3 }, { name: "Szał", rating: null }]);
  });

  it("rozpoznaje dostępne nazwy po typie i podstawie", () => {
    const available = buildAvailability([{ type: "talent", name: "Etykieta (Grupa Społeczna)" }, { type: "skill", name: "Unik" }]);
    expect(isAvailable("Etykieta (Żołnierze)", available.talent)).toBe(true);
    expect(isAvailable("Unik", available.talent)).toBe(false);
    expect(isAvailable("Unik", undefined)).toBe(false);
  });

  it("pomija brakujące pozycje i rozwiązuje wybór z jedną opcją", () => {
    const list = [{ name: "A", group: null }, { name: "Brak", group: null }, { name: "B", group: 1 }, { name: "Brak2", group: 1 }, { name: "C", group: 2 }, { name: "D", group: 2 }];
    const { kept, skipped } = keepAvailable(list, ({ name }) => !name.startsWith("Brak"));
    expect(skipped).toEqual(["Brak", "Brak2"]);
    expect(kept).toEqual([{ name: "A", group: null }, { name: "B", group: null }, { name: "C", group: 2 }, { name: "D", group: 2 }]);
  });

  it("usuwa z wyposażenia puste gałęzie wyboru", () => {
    const tree = { type: "and", id: "root", options: [{ type: "option", id: "a" }, { type: "or", id: "o1", options: [{ type: "option", id: "b" }] }, { type: "or", id: "o2", options: [{ type: "option", id: "c" }, { type: "option", id: "d" }] }] };
    const result = pruneChoices(tree, new Set(["a", "c"]));
    expect(result.options.map((o) => o.id)).toEqual(["a", "o2"]);
    expect(result.options[1].options.map((o) => o.id)).toEqual(["c"]);
  });

  it("wylicza wartość cechy niezależnie od kolejności szablonów", () => {
    expect(traitValue(2, [4, 5], true)).toBe("11");
    expect(traitValue(2, [5], true)).toBe("7");
    expect(traitValue(1, [3, 2], false)).toBe("3");
    expect(traitValue(1, [0], false)).toBe("1");
  });

  it("przenosi tłumaczenia do danych szablonu", () => {
    const system = {
      skills: { list: [{ name: "Melee (Basic)", advances: 5, group: null }] },
      talents: { list: [{ name: "Etiquette (Soldiers)", advances: 1, group: 2 }] },
      lores: { list: [{ name: "petty", number: 3 }, { name: "*", number: 2 }] },
      trappings: { options: [{ name: "Cool", id: "x" }] }
    };
    const result = localizedSystem(system, (n) => resolveName(n, map, (s) => polish[s] ?? s), (k) => (k === "petty" ? "Magia Prosta" : k));
    expect(result["system.skills.list"][0]).toEqual({ name: "Broń Biała (Podstawowa)", advances: 5, group: null });
    expect(result["system.talents.list"][0].group).toBe(2);
    expect(result["system.lores.list"].map((l) => l.name)).toEqual(["Magia Prosta", "*"]);
    expect(result["system.trappings.options"][0].id).toBe("x");
  });

  it("pyta o tradycję raz tylko tam, gdzie wybór się powtarza", () => {
    for (const name of ["Journeyman Wizard", "Wizard", "Master Wizard", "Sorcerer"]) expect(needsLoreChoice(byName(name).system), name).toBe(true);
    for (const name of ["Wizard's Apprentice", "Shaman", "Hedge Witch", "Priest", "Recruit"]) expect(needsLoreChoice(byName(name).system), name).toBe(false);
  });

  it("jedna tradycja ustala Splatanie, Magię Tajemną, Nasycenie i czary", () => {
    const system = withLore(byName("Wizard").system, loreProfile({ value: "fire", key: "fire" }));
    expect(system.skills.list.filter((s) => s.name.startsWith("Channelling"))).toEqual([{ name: "Channelling (Aqshy)", advances: 40, group: null }]);
    const talents = system.talents.list.filter((t) => /^(Arcane Magic|Suffuse)/.test(t.name));
    expect(talents).toEqual([{ name: "Arcane Magic (Fire)", advances: 1, group: null }, { name: "Suffuse with Aqshy", advances: 1, group: null }]);
    expect(system.talents.list.some((t) => t.group)).toBe(false);
    expect(system.lores.list).toEqual([{ name: "petty", number: 3 }, { name: "fire", number: 7 }]);
    expect(needsLoreChoice(system)).toBe(false);
    expect(withLore(byName("Master Wizard").system, loreProfile({ value: "death", key: "death" })).lores.list.find((l) => l.name === "death").number).toBe(13);
  });

  it("zna Wiatr każdej z ośmiu tradycji", () => {
    const winds = byName("Wizard").system.skills.list.filter((s) => s.group).map((s) => s.name).sort();
    expect(Object.values(ARCANE_LORES).map((l) => `Channelling (${l.wind})`).sort()).toEqual(winds);
  });

  it("Czarownik wybiera z każdej tradycji, magowie Kolegiów z ośmiu", () => {
    expect(byName("Sorcerer").flags["wfrp4e-npc-templates"].loreChoice).toBe("any");
    expect(byName("Wizard").flags["wfrp4e-npc-templates"].loreChoice).toBeUndefined();
    expect(arcaneOptions(LABELS).map((o) => o.key)).toEqual(Object.keys(ARCANE_LORES));
  });

  it("buduje listę tradycji z czarów w aktywnych kompendiach", () => {
    const counts = new Map([["petty", 40], ["death", 57], ["fire", 56], ["necromancy", 29], ["greatMaw", 7], ["Undivided", 9],
      ["Lil' Waaagh!", 7], ["big-waaagh", 1], ["Any Lore", 4], ["Death, Life, Shadows", 1], ["High Magic", 5], ["", 40]]);
    const options = loreOptions(counts, LABELS);
    expect(options.map((o) => o.value)).toEqual(["fire", "death", "High Magic", "Lil' Waaagh!", "necromancy", "Undivided", "greatMaw"]);
    expect(options.find((o) => o.value === "Undivided")).toEqual({ value: "Undivided", key: "undivided", label: "Niepodzielony Chaos" });
    // Zapis klucza ma pierwszeństwo, gdy obie wersje mają czary
    expect(loreOptions(new Map([["Undivided", 9], ["undivided", 3]]), LABELS).map((o) => o.value)).toEqual(["undivided"]);
    expect(loreOptions(new Map([["undivided", 3], ["Undivided", 9]]), LABELS).map((o) => o.value)).toEqual(["undivided"]);
  });

  it("z tradycji wynika Splatanie i talent magii", () => {
    const profile = (value, key = null) => loreProfile({ value, key });
    expect(profile("necromancy", "necromancy")).toEqual({ lore: "necromancy", channelling: "Channelling (Dhar)", talent: "Arcane Magic (Necromancy)", suffuse: null });
    expect(profile("tzeentch", "tzeentch").talent).toBe("Chaos Magic (Tzeentch)");
    expect(profile("Undivided", "undivided")).toMatchObject({ lore: "Undivided", talent: "Chaos Magic (Undivided)", channelling: "Channelling (Dhar)" });
    expect(profile("greatMaw", "greatMaw")).toMatchObject({ channelling: "Channelling (Great Maw)", talent: "Arcane Magic (Great Maw)" });
    expect(profile("hedgecraft", "hedgecraft")).toMatchObject({ channelling: "Channelling", talent: "Arcane Magic (Hedgecraft)" });
    expect(profile("Lil' Waaagh!")).toMatchObject({ channelling: "Channelling (Lil' Waaagh!)", talent: "Arcane Magic (Lil' Waaagh!)" });
    expect(profile("High Magic")).toMatchObject({ channelling: "Channelling", talent: "High Magic", suffuse: null });
  });

  it("Czarownik z tradycją spoza Kolegiów nie dostaje Nasycenia ani okien wyboru", () => {
    const system = withLore(byName("Sorcerer").system, loreProfile({ value: "necromancy", key: "necromancy" }));
    expect(system.skills.list.filter((s) => s.name.startsWith("Channelling"))).toEqual([{ name: "Channelling (Dhar)", advances: 20, group: null }]);
    expect(system.talents.list.map((t) => t.name)).toEqual(["Petty Magic", "Instinctive Diction", "Arcane Magic (Necromancy)"]);
    expect(system.lores.list).toEqual([{ name: "petty", number: 3 }, { name: "necromancy", number: 5 }]);
    expect([...system.skills.list, ...system.talents.list].some((e) => e.group)).toBe(false);
  });

  it("zna angielską nazwę tradycji dla etykiety zastępczej", () => {
    expect(loreSpecialisation("dark")).toBe("Dark");
    expect(loreSpecialisation("greatMaw")).toBe("Great Maw");
    expect(loreSpecialisation("fire")).toBe("Fire");
    expect(loreSpecialisation("unknownKey")).toBe("unknownKey");
  });

  it("ma polskie nazwy specjalizacji nowych tradycji", () => {
    const pl = JSON.parse(readFileSync(new URL("../lang/pl.json", import.meta.url), "utf8")).WFRP4E_TEMPLATES.Specialisations;
    for (const key of ["necromancy", "daemonology", "hedgecraft", "witchcraft", "undivided", "dark", "greatMaw", "ruin", "plague", "stealth"]) {
      const spec = loreProfile({ value: key, key }).talent.match(/\((.*)\)/)[1];
      expect(pl[spec], spec).toBeTruthy();
    }
  });

  it("zmienia rozwinięcia bez pytania o koszt w PD", () => {
    expect(templateUpdate()).toEqual({ skipExperienceChecks: true });
    // Foundry dopisuje dane operacji do opcji, więc każda aktualizacja dostaje nowy obiekt
    expect(templateUpdate()).not.toBe(templateUpdate());
    const source = readFileSync(new URL("../scripts/apply.mjs", import.meta.url), "utf8");
    expect(source.match(/updateEmbeddedDocuments\("Item", updates\)/g)).toBeNull();
  });

  it("pyta o bóstwo raz tylko tam, gdzie wybór się powtarza", () => {
    for (const name of ["Warrior Priest", "High Priest"]) expect(needsDeityChoice(byName(name).system), name).toBe(true);
    for (const name of ["Priest", "Novice", "Prophet", "Wizard"]) expect(needsDeityChoice(byName(name).system), name).toBe(false);
    expect(deityOptions(byName("Warrior Priest").system)).toEqual(["Sigmar", "Ulric", "Morr", "Myrmidia", "Taal", "Manann"]);
  });

  it("jedno bóstwo ustala Błogosławieństwo i Inwokację", () => {
    const system = withDeity(byName("High Priest").system, "Ulric");
    const deity = system.talents.list.filter((t) => /^(Bless|Invoke) /.test(t.name));
    expect(deity).toEqual([{ name: "Bless (Ulric)", advances: 1, group: null }, { name: "Invoke (Ulric)", advances: 1, group: null }]);
    expect(system.talents.list.some((t) => t.group)).toBe(false);
    expect(needsDeityChoice(system)).toBe(false);
  });

  it("usuwa z talentu skrypt Błogosławieństwa i rozpoznaje boga z nazwy", () => {
    const bless = { name: "Bless", system: { scriptData: [{ script: `[${BLESS_SCRIPT}]`, trigger: "addItems" }] } };
    const other = { name: "Other", system: { scriptData: [{ script: "[Script.abc]" }] } };
    expect(withoutBlessScript([bless, other])).toEqual([other]);
    expect(withoutBlessScript()).toEqual([]);
    expect(deityInName("Bless (Ulric)")).toBe("Ulric");
    expect(deityInName("Błogosławieństwo (Ulryk)")).toBe("Ulryk");
    expect(deityInName("Bless")).toBeNull();
  });

  it("wybiera błogosławieństwa danego boga", () => {
    const prayer = (name, type, god) => ({ name, uuid: name, system: { type: { value: type }, god: { value: god } } });
    const prayers = [prayer("A", "blessing", "Ulric"), prayer("B", "blessing", "Sigmar, Ulric"), prayer("C", "miracle", "Ulric"), prayer("D", "blessing", "Sigmar"), prayer("E", "blessing", "Ulryk")];
    expect(blessingsFor(prayers, ["Ulric", "Ulryk"]).map((p) => p.name)).toEqual(["A", "B", "E"]);
  });

  it("po nałożeniu szablonu Żywotność jest pełna, a po usunięciu nie wyższa niż maksimum", () => {
    expect(woundsAfterTemplate({ value: 8, max: 14 }, true)).toBe(14);
    expect(woundsAfterTemplate({ value: 14, max: 10 }, false)).toBe(10);
    expect(woundsAfterTemplate({ value: 6, max: 10 }, false)).toBe(6);
  });

  it("ma teksty okna bóstwa w obu językach", () => {
    for (const code of ["en", "pl"]) {
      const lang = JSON.parse(readFileSync(new URL(`../lang/${code}.json`, import.meta.url), "utf8")).WFRP4E_TEMPLATES;
      for (const key of ["Hint", "Label", "Confirm"]) expect(lang.DeityChoice[key], `${code} ${key}`).toBeTruthy();
    }
  });

  it("zapisuje w szablonie tier i kategorię dla Kuźni", () => {
    for (const item of built.items) {
      const flags = item.flags["wfrp4e-npc-templates"];
      expect(flags.tier, item.name).toBe(["I", "II", "III", "IV", "V"].indexOf(item.name.match(/\(Tier ([IV]+)\)$/)[1]) + 1);
      expect(["roles", "tiers", "traits", "people"], item.name).toContain(flags.category);
    }
    expect(byName("Boss").flags["wfrp4e-npc-templates"].category).toBe("tiers");
    expect(byName("Shaman").flags["wfrp4e-npc-templates"].category).toBe("roles");
    expect(byName("Recruit").flags["wfrp4e-npc-templates"].category).toBe("people");
    expect(byName("Reiklander").flags["wfrp4e-npc-templates"].category).toBe("people");
  });

  it("filtruje szablony w Kuźni po tekście, kategorii i tierach", () => {
    const entries = [
      { name: "Szaman (Tier III)", tier: 3, category: "roles", group: "Magia i wiara" },
      { name: "Boss (Tier IV)", tier: 4, category: "tiers", group: "Siła" },
      { name: "Głupi (Tier I)", tier: 1, category: "traits", group: "Słabości" }
    ];
    expect(filterTemplates(entries, { search: "szam" }).map((e) => e.tier)).toEqual([3]);
    expect(filterTemplates(entries, { search: "glupi" }).map((e) => e.tier)).toEqual([1]);
    expect(filterTemplates(entries, { search: "slabosci" }).map((e) => e.tier)).toEqual([1]);
    expect(filterTemplates(entries, { search: "tier" })).toEqual([]);
    expect(filterTemplates(entries, { category: "tiers" }).map((e) => e.tier)).toEqual([4]);
    expect(filterTemplates(entries, { tiers: new Set([1, 4]) }).map((e) => e.tier)).toEqual([4, 1]);
    expect(filterTemplates(entries)).toHaveLength(3);
  });

  it("podsumowuje stos szablonów na odznakę", () => {
    const stack = summarizeStack([{ name: "Elita (Tier III)", tier: 3 }, { name: "Goblin Szaman (Tier III)", tier: 3 }, { name: "Boss (Tier IV)", tier: 4 }]);
    expect(stack.tier).toBe(4);
    expect(stack.count).toBe(3);
    expect(stack.list.map((e) => e.name)).toEqual(["Boss", "Elita", "Goblin Szaman"]);
    expect(summarizeStack([]).count).toBe(0);
    expect(romanTier(5)).toBe("V");
    expect(romanTier(0)).toBe("");
    expect(stripTier("Boss (Tier IV)")).toBe("Boss");
  });

  it("opisuje szablon do podglądu w Kuźni", () => {
    const sergeant = describeTemplate(byName("Sergeant").system, byName("Sergeant").flags["wfrp4e-npc-templates"], { abbrev: { ws: "WW" }, affixMode: "titles" });
    expect(sergeant.characteristics[0]).toEqual({ label: "WW", value: "+15" });
    expect(sergeant.skills).toContain("Melee (Basic) +20");
    expect(sergeant.talents).toContainEqual({ oneOf: ["Reaction Strike", "Strike to Stun", "Shieldsman"] });
    expect(sergeant.talents).toContain("Strike Mighty Blow");
    expect(sergeant.trappings).toContain("Mail Coat");
    expect(sergeant.pre).toBe("Sergeant");
    const veteran = describeTemplate(byName("Veteran").system);
    expect(veteran.trappings).toContainEqual({ oneOf: ["Shield", "Halberd"] });
    const legend = describeTemplate(byName("Legendary").system, {}, { translate: (n) => `[${n}]`, specification: (v) => `<${v}>` });
    expect(legend.traits).toContain("[Ward] <8>");
    expect(legend.talents).toContain("[Strike Mighty Blow] ×2");
    const sorcerer = describeTemplate(byName("Sorcerer").system, byName("Sorcerer").flags["wfrp4e-npc-templates"]);
    expect(sorcerer.lores).toEqual([{ lore: "petty", number: 3 }, { lore: "*", number: 5 }]);
    expect(sorcerer.loreChoice).toBe("any");
    // Jeden wybór tradycji zamiast osobnych wyborów Splatania i Magii Tajemnej
    expect(sorcerer.chooseLore).toBe(true);
    expect([...sorcerer.skills, ...sorcerer.talents].some((entry) => typeof entry !== "string" || /Channelling|Arcane/.test(entry))).toBe(false);
    const warriorPriest = describeTemplate(byName("Warrior Priest").system, {}, { deityLabel: "bóstwo" });
    expect(warriorPriest.chooseDeity).toBe(true);
    expect(warriorPriest.talents).toEqual(expect.arrayContaining(["Bless (bóstwo)", "Invoke (bóstwo)"]));
    const shaman = byName("Shaman").system;
    expect(describeTemplate(shaman, {}, { affixMode: "titles" }).post).toBe("");
    expect(describeTemplate(shaman, {}, { affixMode: "all" }).post).toBe("(Shaman)");
    expect(describeTemplate(byName("Wounded").system).characteristics.every((c) => c.value.startsWith("-"))).toBe(true);
    expect(describeTemplate(byName("Shaman").system, byName("Shaman").flags["wfrp4e-npc-templates"], { spellName: () => "x" }).spells).toHaveLength(6);
    expect(describeTemplate(byName("Hunter").system).trappings).toContain("Arrow ×20");
  });

  it("dopisuje do imienia tylko to, na co pozwala ustawienie", () => {
    const alter = { pre: "Sierżant", post: "(Szaman)" };
    expect(affixesFor("titles", alter)).toEqual({ pre: "Sierżant", post: "" });
    expect(affixesFor("none", alter)).toEqual({ pre: "", post: "" });
    expect(affixesFor("all", alter)).toEqual(alter);
    expect(affixesFor(undefined, alter)).toEqual({ pre: "Sierżant", post: "" });
  });

  it("rozpoznaje tokeny dzielące jednego aktora", () => {
    const a = { uuid: "Actor.a" };
    const b = { uuid: "Scene.s.Token.t.Actor.b" };
    const { actors, shared } = uniqueTargets([{ actor: a }, { actor: a }, { actor: b }, { actor: null }]);
    expect(actors).toEqual([a, b]);
    expect(shared).toBe(1);
  });

  it("cofa szablon jedną aktualizacją aktora, także ze starymi flagami z 0.4–0.5", () => {
    const M = "wfrp4e-npc-templates";
    const actor = {
      name: "Sierżant Hans",
      itemTypes: {
        skill: [
          { id: "s1", name: "Dodge", system: { advances: { value: 25 } }, flags: { [M]: { merged: { T1: 20 } } } },
          { id: "s2", name: "Cool", system: { advances: { value: 5 } }, flags: {} },
          { id: "s3", name: "Intimidate", system: { advances: { value: 30 } }, flags: { [M]: { stack: { base: 0, ratings: { T1: 30 }, adopted: true } } } },
          { id: "s4", name: "Melee", system: { advances: { value: 20 } }, flags: { [M]: { stack: { base: 0, ratings: { T1: 20, T2: 15 }, adopted: true } } } }
        ],
        trait: [{ id: "f1", name: "Armour", system: { specification: { value: "5" } }, flags: { [M]: { traitBase: 2, traitRatings: { T1: 3 } } } }]
      }
    };
    const template = { id: "T1", system: { alterName: { pre: "Sierżant", post: "" } } };
    const { update, deletes } = revertUpdate(actor, template, { translateName: (n) => n, mode: "sum" });
    expect(update.name).toBe("Hans");
    expect(update.items).toEqual([
      { _id: "s1", system: { advances: { value: 5 } }, flags: { [M]: { stack: { base: 5, ratings: {}, adopted: false }, "-=merged": null } } },
      { _id: "s4", system: { advances: { value: 15 } }, flags: { [M]: { stack: { base: 0, ratings: { "-=T1": null }, adopted: true } } } },
      { _id: "f1", system: { specification: { value: "2" } }, flags: { [M]: { stack: { base: 2, ratings: {}, adopted: false } } } }
    ]);
    // Przejęty przedmiot, którego nie potrzebuje już żaden szablon, znika
    expect(deletes).toEqual(["s3"]);
    expect(revertUpdate({ name: "Hans", itemTypes: { skill: [], trait: [] } }, { id: "T2", system: { alterName: { pre: "", post: "" } } }, { mode: "sum" })).toEqual({ update: {}, deletes: [] });
  });

  it("dodaje wkład szablonu i przejmuje przedmiot innego szablonu", () => {
    const M = "wfrp4e-npc-templates";
    const own = { id: "a", flags: {} };
    expect(stackUpdate(own, { kind: "skill", value: 10, templateId: "T2", rating: 20, owner: null, mode: "sum" }))
      .toEqual({ _id: "a", flags: { [M]: { stack: { base: 10, ratings: { T2: 20 }, adopted: false } } }, system: { advances: { value: 30 } } });
    expect(stackUpdate(own, { kind: "skill", value: 10, templateId: "T2", rating: 20, owner: null, mode: "max" }).system.advances.value).toBe(20);
    const fromOther = { id: "b", flags: {} };
    expect(stackUpdate(fromOther, { kind: "skill", value: 15, templateId: "T2", rating: 10, owner: "T1", mode: "max", systemId: "wfrp4e" }))
      .toEqual({ _id: "b", flags: { [M]: { stack: { base: 0, ratings: { T1: 15, T2: 10 }, adopted: true } }, wfrp4e: { fromTemplate: null } }, system: { advances: { value: 15 } } });
    // Cecha bez wartości liczbowej: zapamiętany szablon, wartość bez zmian
    const hardy = stackUpdate({ id: "c", flags: {} }, { kind: "trait", value: 1, templateId: "T2", rating: null, owner: "T1", mode: "sum" });
    expect(hardy.system).toBeUndefined();
    expect(hardy.flags[M].stack.ratings).toEqual({ T1: 1, T2: 1 });
  });

  it("łączy cechy szablonów sumą albo najwyższą wartością", () => {
    const boss = { ws: 10, wp: 10 };
    const legend = { ws: 20, s: 15, wp: 20 };
    const wounded = { ws: -5, s: -5 };
    expect(combineCharacteristics([boss, legend], "sum")).toMatchObject({ ws: 30, s: 15, wp: 30, t: 0 });
    expect(combineCharacteristics([boss, legend], "max")).toMatchObject({ ws: 20, s: 15, wp: 20 });
    // Najsilniejsza kara nie znika pod premią
    expect(combineCharacteristics([legend, wounded], "max")).toMatchObject({ ws: 15, s: 10 });
    expect(combineCharacteristics([wounded, { ws: -10 }], "max")).toMatchObject({ ws: -10 });
  });

  it("liczy wartość z bazy i wkładów szablonów", () => {
    expect(stackedValue(10, { A: 20, B: 15 }, { mode: "sum", kind: "skill" })).toBe(45);
    expect(stackedValue(10, { A: 20, B: 15 }, { mode: "max", kind: "skill" })).toBe(20);
    expect(stackedValue(30, { A: 20 }, { mode: "max", kind: "skill" })).toBe(30);
    expect(stackedValue(2, { A: 3, B: 1 }, { mode: "sum", kind: "trait" })).toBe(3);
    expect(stackedValue(2, { A: 3, B: 1 }, { mode: "sum", kind: "trait", additive: true })).toBe(6);
    expect(stackedValue(2, { A: 3, B: 1 }, { mode: "max", kind: "trait", additive: true })).toBe(3);
    expect(readStack({ kind: "skill", value: 25, flags: { merged: { T1: 20, T2: 0 } } })).toEqual({ base: 5, ratings: { T1: 20 }, adopted: false, legacy: true });
    expect(removeRating({ base: 0, ratings: { A: 1 }, adopted: true }, "A")).toEqual({ stack: { base: 0, ratings: {}, adopted: true }, remove: true });
    expect(addRating(null, { templateId: "B", rating: 5, value: 12, ownerTemplate: null })).toEqual({ base: 12, ratings: { B: 5 }, adopted: false });
  });

  it("w trybie najwyższej wartości dodaje tylko brakujące talenty i odtwarza je po zdjęciu szablonu", () => {
    const owned = new Map([["Strike Mighty Blow", 2], ["Combat Reflexes", 1]]);
    const list = [{ name: "Strike Mighty Blow", advances: 1, group: null }, { name: "Combat Reflexes", advances: 2, group: null },
      { name: "Iron Will", advances: 1, group: null }, { name: "Riposte", advances: 1, group: 1 }];
    expect(missingTalents(list, owned)).toEqual([{ name: "Combat Reflexes", advances: 1, group: null }, { name: "Iron Will", advances: 1, group: null }, { name: "Riposte", advances: 1, group: 1 }]);
    const templates = [{ id: "B", needs: { "Strike Mighty Blow": 1, "Iron Will": 1 } }, { id: "L", needs: { "Strike Mighty Blow": 2 } }];
    expect(talentsToRestore(templates, new Map([["Strike Mighty Blow", 1], ["Iron Will", 1]]))).toEqual([{ templateId: "L", name: "Strike Mighty Blow", count: 1 }]);
    expect(talentsToRestore(templates, new Map([["Strike Mighty Blow", 2], ["Iron Will", 1]]))).toEqual([]);
  });

  it("pokazuje w Kuźni wartości teraz i po nałożeniu szablonu", () => {
    const values = { ws: 40, s: 30, t: 35 };
    const sum = projectCharacteristics(values, [{ ws: 10 }], { ws: 20, t: 5 }, "sum");
    expect(sum.find((c) => c.key === "ws")).toEqual({ key: "ws", value: 40, fromTemplates: 10, projected: 60 });
    expect(sum.find((c) => c.key === "s").projected).toBeNull();
    const max = projectCharacteristics(values, [{ ws: 10 }], { ws: 20, t: 5 }, "max");
    expect(max.find((c) => c.key === "ws").projected).toBe(50);
    expect(projectCharacteristics(values, [], null).every((c) => c.projected === null)).toBe(true);
    const skills = projectSkills([{ name: "Cool", advances: 10 }, { name: "Dodge", advances: 0 }, { name: "Melee", advances: 25 }],
      [{ name: "Cool", advances: 20 }, { name: "Dodge", advances: 5 }, { name: "Melee", advances: 15 }, { name: "Intimidate", advances: 15 }], "max");
    expect(skills).toEqual([
      { name: "Cool", advances: 10, projected: 20 },
      { name: "Dodge", advances: 0, projected: 5 },
      { name: "Intimidate", advances: null, projected: 15 },
      { name: "Melee", advances: 25, projected: null }
    ]);
    expect(projectSkills([{ name: "Melee", advances: 25 }], [{ name: "Melee", advances: 15 }], "sum")).toEqual([{ name: "Melee", advances: 25, projected: 40 }]);
  });

  it("łączy warstwami: najwyższa w warstwie, suma między warstwami, kary zawsze się sumują", () => {
    const entries = [{ value: 10, layer: "roles" }, { value: 15, layer: "roles" }, { value: 10, layer: "tiers" }, { value: 20, layer: "tiers" }, { value: -5, layer: "traits/weakness" }, { value: -10, layer: "traits/weakness" }];
    expect(combineValues(entries, "layers")).toBe(15 + 20 - 15);
    expect(combineValues(entries, "sum")).toBe(40);
    expect(combineValues(entries, "max")).toBe(20 - 10);
    // Wódz + Boss (różne warstwy) się sumują, Boss + Legenda (ta sama warstwa) – nie
    expect(combineCharacteristics([{ ws: 10 }, { ws: 10 }], "layers", ["roles", "tiers"]).ws).toBe(20);
    expect(combineCharacteristics([{ ws: 10 }, { ws: 20 }], "layers", ["tiers", "tiers"]).ws).toBe(20);
    expect(combineCharacteristics([{ ws: 10 }, { ws: 20 }], "layers").ws).toBe(30);
    // Umiejętność: baza aktora + warstwy
    expect(stackedValue(10, { A: 20, B: 15, C: 5 }, { mode: "layers", kind: "skill", layers: { A: "tiers", B: "tiers", C: "roles" } })).toBe(10 + 20 + 5);
    // Cecha stworzenia bez sumowania bierze najwyższą wartość, Pancerz łączy się warstwami
    expect(stackedValue(1, { A: 2, B: 3 }, { mode: "layers", kind: "trait", layers: { A: "x", B: "y" } })).toBe(3);
    expect(stackedValue(1, { A: 2, B: 3 }, { mode: "layers", kind: "trait", additive: true, layers: { A: "x", B: "x" } })).toBe(4);
  });

  it("w trybie warstw wymaga talentów jak warstwy", () => {
    const templates = [{ id: "B", needs: { "Strike Mighty Blow": 1 }, layer: "tiers" }, { id: "L", needs: { "Strike Mighty Blow": 2 }, layer: "tiers" }, { id: "W", needs: { "Strike Mighty Blow": 1 }, layer: "roles" }];
    expect(talentRequirements(templates, "layers").get("Strike Mighty Blow")).toEqual({ count: 3, templateId: "L" });
    expect(talentRequirements(templates, "max").get("Strike Mighty Blow").count).toBe(2);
    const required = talentRequirements(templates, "layers");
    expect(missingTalents([{ name: "Strike Mighty Blow", advances: 1, group: null }], new Map([["Strike Mighty Blow", 2]]), required)).toEqual([{ name: "Strike Mighty Blow", advances: 1, group: null }]);
    expect(missingTalents([{ name: "Strike Mighty Blow", advances: 1, group: null }], new Map([["Strike Mighty Blow", 3]]), required)).toEqual([]);
    expect(talentsToRestore(templates.slice(1), new Map([["Strike Mighty Blow", 1]]), "layers")).toEqual([{ templateId: "L", name: "Strike Mighty Blow", count: 2 }]);
  });

  it("zapisuje warstwę każdego szablonu", () => {
    const layer = (name) => byName(name).flags["wfrp4e-npc-templates"].layer;
    expect(layer("Boss")).toBe("tiers");
    expect(layer("Nemesis")).toBe("tiers");
    expect(layer("Warlord")).toBe("roles");
    expect(layer("Captain")).toBe("people");
    expect(layer("Reiklander")).toBe("people/origins");
    expect(layer("Innkeeper")).toBe("people/trades");
    expect(layer("Mighty")).toBe("traits/body");
    expect(layer("Mark of Decay")).toBe("traits/taint");
    expect(layer("Wounded")).toBe("traits/weakness");
  });

  it("ma podpowiedź dla MG w obu językach dla każdego szablonu", () => {
    expect(Object.keys(HINTS)).toHaveLength(built.items.length);
    for (const item of built.items) {
      expect(item.system.gmdescription.value, item.name).toMatch(/^<p>.{20,}<\/p>$/);
      expect(built.translation.entries[item.name].gmdescription, item.name).toMatch(/^<p>.{20,}<\/p>$/);
    }
    expect(built.translation.mapping.gmdescription).toBe("system.gmdescription.value");
    const all = { archetypes: ARCHETYPES, humanGroups: HUMAN_GROUPS, roleGroups: ROLE_GROUPS, tierGroups: TIER_GROUPS, traitGroups: TRAIT_GROUPS, coreItems, coreTraits, powerTiers: POWER_TIERS };
    expect(() => buildAll({ ...all, hints: { ...HINTS, "soldier/nope": ["a", "b"] } })).toThrow(/soldier\/nope/);
  });

  it("nie ma dwóch szablonów o tej samej nazwie po polsku ani po angielsku", () => {
    const pl = Object.values(built.translation.entries).map((entry) => entry.name);
    expect(new Set(pl).size).toBe(pl.length);
    expect(byName("Slippery")).toBeTruthy();
    expect(byName("Cunning")).toBeUndefined();
  });

  it("usuwa dopisek szablonu z imienia, także ze środka", () => {
    expect(stripAffixes("Goblin (Tarczownik) (Dobosz)", "", "(Tarczownik)")).toBe("Goblin (Dobosz)");
    expect(stripAffixes("Goblin (Tarczownik) (Dobosz)", "", "(Dobosz)")).toBe("Goblin (Tarczownik)");
    expect(stripAffixes("Kapitan Sierżant Hans", "Sierżant", "")).toBe("Kapitan Hans");
    expect(stripAffixes("Mistrz Hans (Szaman)", "Mistrz", "(Szaman)")).toBe("Hans");
    expect(stripAffixes("Goblin (Szaman) (Szaman)", "", "(Szaman)")).toBe("Goblin (Szaman)");
    expect(stripAffixes("Goblin", "", "(Szaman)")).toBe("Goblin");
    expect(stripAffixes("Goblin (Szamanka)", "", "(Szaman)")).toBe("Goblin (Szamanka)");
  });
});
