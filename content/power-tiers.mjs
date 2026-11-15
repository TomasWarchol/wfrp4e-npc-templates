/**
 * Tier siły szablonu (1–5 = Tier I–V). Builder dopisuje go do nazwy EN i PL, np. "Boss (Tier IV)".
 * Klucz to "grupa/id", tak jak w tools/pack-builder.mjs. Kryteria i uzasadnienia: docs/power-tiers.md.
 */
export const POWER_TIERS = {
  // Role
  "role-command/chieftain": 2, "role-command/warlord": 4, "role-command/standard-bearer": 2, "role-command/drummer": 1, "role-command/agitator": 1, "role-command/tactician": 2,
  "role-magic/shaman": 3, "role-magic/sorcerer": 4, "role-magic/acolyte": 2, "role-magic/necromancer": 3, "role-magic/dark-priest": 3, "role-magic/prophet": 2,
  "role-front/thug": 3, "role-front/shield-bearer": 2, "role-front/berserker": 3, "role-front/champion": 3, "role-front/bodyguard": 2, "role-front/duelling-master": 3, "role-front/brawler": 2,
  "role-ambush/sharpshooter": 3, "role-ambush/skirmisher": 2, "role-ambush/assassin": 3, "role-ambush/scout": 2, "role-ambush/pathfinder": 1,
  "role-support/healer": 1, "role-support/poisoner": 2, "role-support/saboteur": 1, "role-support/beastmaster": 1, "role-support/rider": 2, "role-support/torturer": 2,
  // Poziom zagrożenia
  "tier-strength/cannon-fodder": 1, "tier-strength/grizzled": 2, "tier-strength/elite": 3, "tier-strength/boss": 4, "tier-strength/legendary": 5,
  "bane/apex-predator": 4, "bane/nemesis": 5, "bane/unkillable": 5, "bane/scourge": 5, "bane/spell-breaker": 4, "bane/doom-incarnate": 5,
  // Cechy
  "body/mighty": 2, "body/hulking": 2, "body/brutish": 2, "body/swift": 2, "body/hardened": 2, "body/ancient": 4, "body/venomous": 2, "body/thick-hided": 2, "body/iron-hided": 3, "body/horned": 1, "body/lashing-tail": 2, "body/winged": 2, "body/wall-crawler": 1,
  "nature/sly": 1, "nature/cunning": 1, "nature/fanatic": 2, "nature/rabid": 2, "nature/lurker": 1, "nature/marsh-dweller": 1, "nature/man-eater": 1, "nature/territorial": 1,
  "powers/fire-breather": 3, "powers/frost-breather": 3, "powers/plague-breather": 3, "powers/storm-breather": 3, "powers/aethyric-ward": 2, "powers/spell-eater": 2, "powers/petrifying": 3,
  "taint/chaos-marked": 2, "taint/mark-of-blood": 4, "taint/mark-of-decay": 4, "taint/mark-of-excess": 3, "taint/mark-of-change": 3, "taint/warpstone-gorged": 2, "taint/spawn-flesh": 3, "taint/daemon-possessed": 4, "taint/tainted": 2, "taint/blood-sworn": 2, "taint/plague-touched": 2, "taint/libertine": 1, "taint/schemer": 1, "taint/thrall": 1, "taint/skaven-informant": 1, "taint/hedge-witch": 2, "taint/grave-robber": 2,
  "undeath/risen": 2, "undeath/grave-chill": 2, "undeath/blood-drinker": 2, "undeath/spectral": 4, "undeath/wight-lord": 4, "undeath/deathless": 5,
  "weakness/dim-witted": 1, "weakness/cowed": 1, "weakness/coward": 1, "weakness/drunkard": 1, "weakness/wounded": 1, "weakness/plague-ridden": 1, "weakness/one-eyed": 1, "weakness/starving": 1, "weakness/madman": 1, "weakness/hunchback": 1, "weakness/exhausted": 1, "weakness/cursed": 1, "weakness/scarred": 1,
  // Ludzie – archetypy (stopnie sumują poprzednie)
  "soldier/recruit": 2, "soldier/veteran": 3, "soldier/sergeant": 3, "soldier/captain": 4,
  "watch/night-watchman": 1, "watch/watchman": 2, "watch/watch-sergeant": 3, "watch/watch-captain": 3,
  "outlaw/footpad": 1, "outlaw/bandit": 2, "outlaw/highwayman": 3, "outlaw/bandit-chief": 4,
  "cultist/cult-initiate": 1, "cultist/cultist": 2, "cultist/cult-zealot": 3, "cultist/cult-leader": 3,
  "hunter/trapper": 1, "hunter/hunter": 2, "hunter/road-warden": 3, "hunter/beast-slayer": 4,
  "sailor/deckhand": 1, "sailor/smuggler": 2, "sailor/reaver": 3, "sailor/ship-captain": 3,
  "noble/scion": 1, "noble/courtier": 2, "noble/duellist": 3, "noble/noble-lord": 3,
  "merchant/peddler": 1, "merchant/trader": 2, "merchant/merchant": 2, "merchant/guild-master": 2,
  "thief/urchin": 1, "thief/pickpocket": 2, "thief/burglar": 2, "thief/gang-boss": 3,
  "healer/herbalist": 1, "healer/barber-surgeon": 2, "healer/physician": 2, "healer/master-physician": 2,
  "wizard/apprentice": 2, "wizard/journeyman": 3, "wizard/wizard": 4, "wizard/master-wizard": 4,
  "priest/novice": 1, "priest/priest": 2, "priest/warrior-priest": 4, "priest/high-priest": 4,
  // Ludzie – tło
  "origins/reiklander": 1, "origins/middenheimer": 1, "origins/stirlander": 1, "origins/nordlander": 1, "origins/hochlander": 1, "origins/kislevite": 1, "origins/tilean": 1, "origins/bretonnian": 1, "origins/estalian": 1, "origins/norscan": 2,
  "trades/innkeeper": 1, "trades/blacksmith": 2, "trades/farmer": 1, "trades/scribe": 1, "trades/miner": 2, "trades/coachman": 1, "trades/servant": 1, "trades/beggar": 1, "trades/entertainer": 1, "trades/butcher": 2, "trades/fisher": 1,
  "faith/sigmarite": 1, "faith/ulrican": 1, "faith/shallyan": 1, "faith/morrite": 1, "faith/ranaldan": 1, "faith/flagellant": 2, "faith/witch-hunter-agent": 1, "faith/doubter": 1,
  "status/wealthy-patron": 1, "status/local-hero": 1, "status/spy": 1, "status/disgraced": 1, "status/wanted": 1, "status/corrupt-official": 1
};
