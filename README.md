# WFRP4e – NPC Templates (`wfrp4e-npc-templates`)

**English** | [Polski](README.pl.md)

Ready-made templates for WFRP4e: drag a rank or a quirk onto an actor to change its characteristics, skills, talents and gear.

Requires **Foundry VTT v14**, the **WFRP4e** system **10.0+** and the **WFRP4e Core Rulebook** module, which supplies the talents, skills and gear.

## What's inside

The **WFRP4e: NPC Templates** compendium is built for making enemies quickly. Drop templates onto any actor and combine them: Goblin plus Shaman makes a goblin shaman, and Goblin plus Warlord plus Elite makes the one in charge.

| Folder | The question it answers | How many to use |
|---|---|---|
| **Roles** (30) | Who is it in the group? | one |
| **Threat Level** (11) | How dangerous is it? | one, plus Bane of Heroes for a real boss |
| **Traits** (64) | What is special about it? | any number |
| **People** (83) | Do you need a ready human from scratch? | one rank, plus any background |

**Roles** work on any race and add themselves to the name, for example "Goblin (Shaman)".

- **Command:** Chieftain, Warlord, Standard Bearer, Drummer, Agitator, Tactician
- **Magic and Faith:** Shaman, Sorcerer, Acolyte, Necromancer, Dark Priest, Prophet
- **Front Line:** Thug, Shield Bearer, Berserker, Champion, Bodyguard, Duelling Master, Brawler
- **Ranged and Ambush:** Sharpshooter, Skirmisher, Assassin, Scout, Pathfinder
- **Support:** Healer, Poisoner, Saboteur, Beastmaster, Rider, Torturer

Casters get a fixed set of memorised spells with no selection windows. The Sorcerer asks you to pick a Lore.

**Threat Level:** Cannon Fodder, Grizzled, Elite, Boss, Legendary and six very strong Bane of Heroes templates.

**Power tiers:** every template name ends with a tier from **Tier I** (cosmetic or a weakness) to **Tier V** (campaign finale), for example "Boss (Tier IV)". The tier says how much more dangerous in combat a template makes the actor. Criteria and a short reason for each template are in [docs/power-tiers.md](docs/power-tiers.md) (Polish).

**Traits:** Body, Nature, Powers, Taint, Undeath and Weaknesses.

**People:** 12 archetypes of 4 ranks each, with Origins, Walks of Life, Faith and Reputation for background.

Items missing from your active compendiums are skipped, and a notice says what was left out. Talents from add-on books are optional and are skipped silently.

Each rank already includes the lower ones, so give an actor one rank.

## How to use it

**Enemy Forge (GM).** Select one or more tokens, open the token HUD and click the hammer. The panel lists every template with search, categories and a tier filter. Click a template to preview what it gives: characteristics, skills, talents, creature traits, magic, trappings and choices. Apply it to all selected tokens with the button under the preview or with + on the row, and click × on an applied one to remove it from all of them. Linked tokens that share an actor change together, and the panel warns about that.

**GM-only badge.** A token with templates shows a small badge with its highest tier, for example "IV ·2" for two templates. Hovering over the token lists them. Only the GM's screen draws this, so players never see it. By default the name gets only titles such as "Sergeant", not roles in brackets; the **Titles in actor names** setting changes that.

**Current values.** The right side of the Forge shows the selected token's characteristics (with the part that comes from templates), Wounds, skill advances, talents and creature traits. With several targets, pick which one to show. When you preview a template, characteristics and skills also show the value after applying it.

**Stacking templates.** The **Stacking templates** setting decides how several templates on one actor combine. **Layers** (the default): a role, a threat level, a rank, each group of traits and each background add up, but two templates from the same layer take the highest value. Warlord WS +10 and Boss WS +10 give WS +20, while Boss WS +10 and Legendary WS +20 give WS +20. Penalties always add up. **Add up**: everything adds. **Highest value**: only the strongest bonus and the strongest penalty count. The same goes for skill advances, talent ranks and creature traits. A skill or creature trait that two templates need stays until the last of them is removed.

**GM hints.** Every template has a short GM note on what it is for and what it pairs with. It shows in the Forge preview and in the template's GM description.

Drag a template onto a character, NPC or creature. It changes the characteristics and adds skills, talents and gear. Some ranks ask you to pick a talent or a weapon, wizards choose their spells, and a few ranks add a title such as "Sergeant" to the name.

Templates use the system's own Template item, so they appear under **Applied Templates** on the Notes tab. Deleting one there undoes it. A skill the actor already has gains the extra advances instead of being listed twice. A trait the actor already has is raised to the higher rating, and Armour adds up. All of this is removed with the template.

Anything missing from your active compendiums is skipped, and a notice lists what was left out. Talents from add-on books are optional extras, so they are skipped without a notice.

Each rank already includes the ranks below it, so apply only one rank per actor and add quirks on top.

The interface follows Foundry's language: **English** and **Polish** are built in, and more languages can be added (see *Languages*); anything untranslated falls back to English.

## 📥 Installation

Paste this into *Manifest URL* in **Add-on Modules → Install Module**:

```
https://github.com/TomasWarchol/wfrp4e-npc-templates/releases/latest/download/module.json
```

## 🌐 Languages

English and Polish are built in. To add another language:

```bash
npm run lang:add -- de "Deutsch"
```

This creates `lang/de.json` (a copy of the English texts) and registers it in `module.json`. Translate the texts; any key you leave out falls back to English, and `npm run check` lists the untranslated keys. Translations are welcome as pull requests.

A separate translation module can also add a language without touching this one: it declares a `languages` entry with `"lang": "de"` that points to its own file with the same keys.

Template names and descriptions are translated through [Babele](https://foundryvtt.com/packages/babele). Copy `compendium/pl` to `compendium/<code>`, translate it and add the code to `COMPENDIUM_LANGUAGES` in `scripts/main.mjs`. Talent and skill names follow the translated compendium automatically. Specialisations such as "Soldiers" come from the `Specialisations` section of the language file.

## 🛠️ Development

```bash
npm install
npm run check   # manifest + translations, lint, tests
npm run packs   # build the compendium and the Polish translation from content/templates.mjs
npm run link    # link this folder into your local Foundry Data/modules
```

## 📄 License

MIT – see [LICENSE](LICENSE).

Unofficial fan content, not affiliated with or endorsed by Games Workshop or Cubicle 7. Warhammer and all related names are trademarks of Games Workshop Limited. The module ships no rulebook text or artwork; it works with the content you already own.
