/**
 * Buduje kompendium (packs/npc-templates) i tłumaczenie (compendium/pl) z content/templates.mjs.
 * Użycie: npm run packs
 */
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { ADDON_TALENTS } from "../content/addon-talents.mjs";
import { HUMAN_GROUPS } from "../content/human-overlays.mjs";
import { ROLE_GROUPS } from "../content/roles.mjs";
import { TIER_GROUPS } from "../content/tiers.mjs";
import { TRAIT_GROUPS } from "../content/traits.mjs";
import { ARCHETYPES } from "../content/templates.mjs";
import { buildAll, MODULE_ID, PACK_NAME } from "./pack-builder.mjs";

const root = resolve(import.meta.dirname, "..");
const coreItems = JSON.parse(readFileSync(join(root, "content", "core-items.json"), "utf8"));
const coreTraits = JSON.parse(readFileSync(join(root, "content", "core-traits.json"), "utf8"));
const { folders, items, translation } = buildAll({ archetypes: ARCHETYPES, humanGroups: HUMAN_GROUPS, roleGroups: ROLE_GROUPS, tierGroups: TIER_GROUPS, traitGroups: TRAIT_GROUPS, coreItems, coreTraits, addonTalents: ADDON_TALENTS });

const source = mkdtempSync(join(tmpdir(), `${PACK_NAME}-`));
for (const doc of [...folders, ...items]) writeFileSync(join(source, `${doc._id}.json`), JSON.stringify(doc));

const destination = join(root, "packs", PACK_NAME);
if (existsSync(destination)) rmSync(destination, { recursive: true });
mkdirSync(join(root, "packs"), { recursive: true });
await compilePack(source, destination, { log: false });
rmSync(source, { recursive: true });

mkdirSync(join(root, "compendium", "pl"), { recursive: true });
writeFileSync(join(root, "compendium", "pl", `${MODULE_ID}.${PACK_NAME}.json`), `${JSON.stringify(translation, null, 2)}\n`);
console.log(`✔ ${items.length} szablonów w ${folders.length} folderach`);
