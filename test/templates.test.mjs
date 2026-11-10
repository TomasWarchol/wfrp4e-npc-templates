import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ARCHETYPES } from "../content/templates.mjs";
import { ADDON_TALENTS } from "../content/addon-talents.mjs";
import { HUMAN_GROUPS } from "../content/human-overlays.mjs";
import { ROLE_GROUPS } from "../content/roles.mjs";
import { TIER_GROUPS } from "../content/tiers.mjs";
import { TRAIT_GROUPS } from "../content/traits.mjs";
import { accumulateRank, buildAll, buildSpellLinks, buildTraits, buildTrappings, stableId } from "../tools/pack-builder.mjs";
import { buildAvailability, buildNameMap, isAvailable, resolveName } from "../scripts/names.mjs";
import { grantedItemData, keepAvailable, localizedSystem, pruneChoices, splitOwnedSkills, splitOwnedTraits, traitValue } from "../scripts/apply.mjs";

const coreItems = JSON.parse(readFileSync(new URL("../content/core-items.json", import.meta.url), "utf8"));
const coreTraits = JSON.parse(readFileSync(new URL("../content/core-traits.json", import.meta.url), "utf8"));
const built = buildAll({ archetypes: ARCHETYPES, humanGroups: HUMAN_GROUPS, roleGroups: ROLE_GROUPS, tierGroups: TIER_GROUPS, traitGroups: TRAIT_GROUPS, coreItems, coreTraits, addonTalents: ADDON_TALENTS });
const byName = (name) => built.items.find((item) => item.name === name);

describe("zestaw szablonów", () => {
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
    expect(built.translation.entries.Shaman.post).toBe("(Szaman)");
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
    expect(built.items.filter((i) => i.name === "Elite")).toHaveLength(1);
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
    expect(raise).toEqual([{ name: "Pancerz", rating: 2 }, { name: "Strach", rating: 1 }, { name: "Groza", rating: 3 }]);
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
});
