# WFRP4e – NPC Templates (`wfrp4e-npc-templates`)

**English** | [Polski](README.pl.md)

Ready-made templates for WFRP4e: drag a rank or a quirk onto an actor to change its characteristics, skills, talents and gear.

Requires **Foundry VTT v14**, the **WFRP4e** system **10.0+** and the **WFRP4e Core Rulebook** module, which supplies the talents, skills and gear.

## What's inside

The **WFRP4e: NPC Templates** compendium holds 59 templates:

- **12 archetypes with 4 ranks each.** Soldier (Recruit, Veteran, Sergeant, Captain), City Watch, Outlaw, Cultist, Hunter, River & Sea, Nobility, Trade, Underworld, Healing, Wizardry and Clergy.
- **11 quirks that combine with anything.** Greenhorn, Grizzled, Elite, Brute, Cunning, Fanatic, Coward, Drunkard, Wounded, Tainted and Bodyguard.

## How to use it

Drag a template onto a character, NPC or creature. It changes the characteristics and adds skills, talents and gear. Some ranks ask you to pick a talent or a weapon, wizards choose their spells, and a few ranks add a title such as "Sergeant" to the name.

Templates use the system's own Template item, so they appear under **Applied Templates** on the Notes tab. Deleting one there undoes it. A skill the actor already has gains the extra advances instead of being listed twice, and those advances are removed with the template.

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
