/**
 * WFRP4e – NPC Templates
 * Kompendium gotowych szablonów oraz dopasowanie ich do aktywnego tłumaczenia.
 */
import { MODULE_ID, log } from "./constants.mjs";
import { checkTemplates, installApplyHooks, loadNames } from "./apply.mjs";

/** Języki z gotowym tłumaczeniem kompendium (katalogi compendium/<kod>). */
const COMPENDIUM_LANGUAGES = ["pl"];

Hooks.once("babele.init", (babele) => {
  for (const lang of COMPENDIUM_LANGUAGES) babele.register({ module: MODULE_ID, lang, dir: `compendium/${lang}` });
});

Hooks.once("init", () => {
  installApplyHooks();
  game.modules.get(MODULE_ID).api = {
    check: () => checkTemplates(game.packs.get(`${MODULE_ID}.npc-templates`))
  };
});

Hooks.once("ready", async () => {
  await loadNames();
  log.info("ready");
});
