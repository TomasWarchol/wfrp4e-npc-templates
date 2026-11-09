import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ARCHETYPES, QUIRKS } from "../content/templates.mjs";
import { accumulateRank, buildAll, buildTrappings, stableId } from "../tools/pack-builder.mjs";
import { buildNameMap, resolveName } from "../scripts/names.mjs";
import { localizedSystem, splitOwnedSkills } from "../scripts/apply.mjs";

const coreItems = JSON.parse(readFileSync(new URL("../content/core-items.json", import.meta.url), "utf8"));
const built = buildAll({ archetypes: ARCHETYPES, quirks: QUIRKS, coreItems });
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
    const exact = /^(Melee|Ranged|Stealth|Ride|Sail|Language|Secret Signs|Channelling|Perform) \(|^Lore \((Magick|Theology|Law|Heraldry)\)|^Trade \(Apothecary\)/;
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
