/**
 * WFRP4e – NPC Templates
 * Kompendium gotowych szablonów oraz dopasowanie ich do aktywnego tłumaczenia.
 */
import { I18N, MODULE_ID, PACK_ID, log } from "./constants.mjs";
import { checkTemplates, installApplyHooks, installCharacteristicStacking, loadNames } from "./apply.mjs";
import { installTooltipCleanup, onHoverToken, updateActorBadges, updateBadge } from "./badge.mjs";
import { addHudButton, refreshForge } from "./forge.mjs";

/** Języki z gotowym tłumaczeniem kompendium (katalogi compendium/<kod>). */
const COMPENDIUM_LANGUAGES = ["pl"];

Hooks.once("babele.init", (babele) => {
  for (const lang of COMPENDIUM_LANGUAGES) babele.register({ module: MODULE_ID, lang, dir: `compendium/${lang}` });
});

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "nameAffixes", {
    name: `${I18N}.Settings.NameAffixes.Name`,
    hint: `${I18N}.Settings.NameAffixes.Hint`,
    scope: "world",
    config: true,
    type: String,
    default: "titles",
    choices: {
      titles: `${I18N}.Settings.NameAffixes.Titles`,
      none: `${I18N}.Settings.NameAffixes.None`,
      all: `${I18N}.Settings.NameAffixes.All`
    }
  });
  game.settings.register(MODULE_ID, "stacking", {
    name: `${I18N}.Settings.Stacking.Name`,
    hint: `${I18N}.Settings.Stacking.Hint`,
    scope: "world",
    config: true,
    type: String,
    default: "layers",
    choices: {
      layers: `${I18N}.Settings.Stacking.Layers`,
      sum: `${I18N}.Settings.Stacking.Sum`,
      max: `${I18N}.Settings.Stacking.Max`
    },
    onChange: onStackingChange
  });
  installApplyHooks();
  installTooltipCleanup();
  game.modules.get(MODULE_ID).api = {
    check: () => checkTemplates(game.packs.get(PACK_ID))
  };
});

/* Tryb łączenia cech działa przy każdym przeliczeniu aktora; system rejestruje modele danych w init */
Hooks.once("setup", installCharacteristicStacking);

/** Po zmianie trybu łączenia cechy przeliczają się od razu (umiejętności i talenty – przy kolejnej zmianie szablonów). */
function onStackingChange() {
  const actors = [...game.actors, ...(canvas.tokens?.placeables ?? []).map((token) => token.actor).filter((actor) => actor?.isToken)];
  for (const actor of actors) {
    actor.reset();
    actor.render(false);
  }
  refreshForge();
}

/* Kuźnia przeciwnika i odznaka MG */
Hooks.on("renderTokenHUD", addHudButton);
Hooks.on("drawToken", updateBadge);
Hooks.on("refreshToken", updateBadge);
Hooks.on("hoverToken", onHoverToken);
Hooks.on("controlToken", refreshForge);

/** Szablon dodany albo usunięty: odznaki tokenów aktora i otwarty panel. */
function onTemplateChange(item) {
  if (item.type !== "template" || !item.parent) return;
  updateActorBadges(item.parent);
  refreshForge();
}
Hooks.on("createItem", onTemplateChange);
Hooks.on("deleteItem", onTemplateChange);

/* Obecne wartości w Kuźni zmieniają się chwilę po nałożeniu szablonu (system dodaje przedmioty partiami) */
for (const hook of ["updateActor", "updateItem", "createItem", "deleteItem"]) Hooks.on(hook, () => refreshForge());

Hooks.once("ready", async () => {
  await loadNames();
  log.info("ready");
});
