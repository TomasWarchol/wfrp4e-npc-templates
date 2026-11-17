# Changelog

## 0.4.2
- **The Sorcerer can use any Lore of Magic.** The list shows every Lore that has spells in your active compendiums, including those from add-ons: Necromancy, Daemonology, the Chaos gods, Hedgecraft, Witchcraft, the Great Maw, the Skaven Lores, Dark Magic, High Magic and the Waaagh. The choice sets the matching Channelling (a Wind, Dhar or the Lore's own) and talent (Arcane Magic, Chaos Magic or High Magic). Suffuse is added only for the eight Lores of the Colleges. This fixes 0.4.1, which limited the Sorcerer to those eight.
- Journeyman Wizard, Wizard and Master Wizard stay with the eight Lores of the Colleges of Magic.
- Lores that an add-on registers with an untranslated name, such as Dark Magic and the Great Maw, show a readable name in the choice.

## 0.4.1
- Wizard templates (Journeyman Wizard, Wizard, Master Wizard, Sorcerer) ask for the Lore of Magic once. That one choice sets Channelling, Arcane Magic, the Suffuse talent and the Lore of the spells. Before, each of the four was a separate question.
- Removing a template removes its title from the actor's name, wherever it is. Before, with several templates, only a title at the very start or end was removed, so "Goblin (Shield Bearer) (Drummer)" kept "(Shield Bearer)".

## 0.4.0
- **New layout for quick enemies.** Four folders: Roles, Threat Level, Traits and People. Any template works on any race: Goblin plus Shaman makes a goblin shaman.
- **30 roles**, such as Chieftain, Warlord, Standard Bearer, Shaman, Necromancer, Shield Bearer, Assassin, Healer and Beastmaster. A role adds itself to the name, for example "Goblin (Shaman)".
- **Threat Level**: Cannon Fodder, Grizzled, Elite, Boss and Legendary, plus the very strong Bane of Heroes templates.
- Traits now gather what was scattered: Body, Nature, Powers, Taint, Undeath and Weaknesses. Duplicates were merged into one version each.
- Casters such as the Shaman and Necromancer get a fixed set of memorised spells, with no selection windows. The Sorcerer still asks for a Lore.
- **Power tiers.** Every template name now ends with Tier I–V, for example "Boss (Tier IV)", in English and Polish. The tier rates how much more dangerous in combat the template makes an actor under WFRP4e rules. Criteria and a reason for each template are in `docs/power-tiers.md`.
- Templates already applied to actors keep their old names. Document ids are unchanged.

## 0.3.0
- Templates now use talents from add-on books where they fit. A group without the book simply does not get them, with no warning.

## 0.2.1
- A talent, skill, trait or piece of gear missing from your active compendiums is now skipped with a notice. Before, the system stopped and the rest of the template was not added.

## 0.2.0
- 113 new templates: 59 themed overlays for people and 54 upgrades for monsters, including very strong ones for demanding parties.
- Two top-level categories in the compendium: People and Monsters & Upgrades.
- Templates can add creature traits. A trait the actor already has is raised instead of duplicated, and removing the template restores it.

## 0.1.0
- First version: 48 ranks in 12 archetypes and 11 quirks, in English and Polish.
