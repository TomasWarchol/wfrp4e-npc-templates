/**
 * Odznaka szablonów na tokenie i dymek po najechaniu. Rysuje je tylko klient MG, więc gracze ich nie widzą:
 * nic nie trafia do danych tokena ani aktora.
 */
import { t } from "./constants.mjs";
import { managedTemplates, templateTier } from "./forge.mjs";
import { TIER_COLORS, romanTier, summarizeStack } from "./forge-model.mjs";

const BADGE = Symbol("wfrp4e-npc-templates.badge");
let tooltip = null;

function stackOf(token) {
  return summarizeStack(managedTemplates(token.actor).map((item) => ({ name: item.name, tier: templateTier(item) })));
}

/** Rysuje, zmienia albo usuwa odznakę tokena. */
export function updateBadge(token) {
  if (!game.user.isGM || !token || token.destroyed) return;
  const stack = token.actor ? stackOf(token) : { count: 0 };
  let badge = token[BADGE];
  if (!stack.count) {
    if (badge && !badge.destroyed) badge.destroy({ children: true });
    token[BADGE] = null;
    return;
  }
  const scale = Math.max(0.6, (canvas.dimensions?.size ?? 100) / 100);
  const key = `${stack.signature}@${scale}`;
  if (!badge || badge.destroyed) {
    badge = new PIXI.Container();
    badge.eventMode = "none";
    badge.zIndex = 50;
    token.addChild(badge);
    token[BADGE] = badge;
  }
  if (badge.key !== key) {
    for (const child of badge.removeChildren()) child.destroy();
    const label = new PIXI.Text(stack.count > 1 ? `${romanTier(stack.tier)} ·${stack.count}` : romanTier(stack.tier), {
      fontFamily: "Signika", fontSize: 13 * scale, fontWeight: "700", fill: 0xffffff
    });
    const padX = 5 * scale;
    const padY = 1 * scale;
    const background = new PIXI.Graphics();
    background.beginFill(TIER_COLORS[stack.tier - 1] ?? 0x555555, 0.95)
      .lineStyle(1.5 * scale, 0x000000, 0.6)
      .drawRoundedRect(0, 0, label.width + 2 * padX, label.height + 2 * padY, 6 * scale)
      .endFill();
    label.position.set(padX, padY);
    badge.addChild(background, label);
    badge.key = key;
  }
  // Prawy górny róg tokena, lekko wysunięty poza krawędź
  badge.position.set(token.w - badge.width * 0.75, -badge.height * 0.25);
}

/** Odświeża odznaki wszystkich tokenów aktora na aktywnej scenie. */
export function updateActorBadges(actor) {
  if (!game.user.isGM || !actor) return;
  for (const token of actor.getActiveTokens?.() ?? []) updateBadge(token);
}

function hideTooltip() {
  tooltip?.remove();
  tooltip = null;
}

/** Dymek ze stosem szablonów po najechaniu na token (tylko MG). */
export function onHoverToken(token, hovered) {
  hideTooltip();
  if (!game.user.isGM || !hovered || !token.actor) return;
  const stack = stackOf(token);
  if (!stack.count) return;
  const corner = canvas.clientCoordinatesFromCanvas({ x: token.x + token.w, y: token.y });
  tooltip = document.createElement("aside");
  tooltip.className = "wfrp4e-npc-templates-tooltip";
  tooltip.innerHTML = `<h4>${t("Forge.BadgeTitle")}</h4><ul>${stack.list.map((entry) =>
    `<li><span class="forge-tier tier-${entry.tier}">${romanTier(entry.tier)}</span>${foundry.utils.escapeHTML(entry.name)}</li>`).join("")}</ul>`;
  tooltip.style.left = `${Math.round(corner.x + 8)}px`;
  tooltip.style.top = `${Math.round(corner.y)}px`;
  document.body.appendChild(tooltip);
}

/** Dymek znika przy przesuwaniu widoku i zmianie sceny. */
export function installTooltipCleanup() {
  Hooks.on("canvasPan", hideTooltip);
  Hooks.on("canvasTearDown", hideTooltip);
}
