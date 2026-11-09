/**
 * Talenty spoza podręcznika głównego. Grupa bez danego dodatku po prostu ich nie dostaje, bez ostrzeżenia.
 */
const WINDS = ["Aqshy", "Azyr", "Chamon", "Ghur", "Ghyran", "Hysh", "Shyish", "Ulgu"];

export const SUFFUSE_WINDS = WINDS.map((wind) => `Suffuse with ${wind}`);

export const ADDON_TALENTS = [
  "Chanty", "Glorious Demise", "Harpooner", "Kingsguard", "Magic Defiance", "Master and Commander",
  "Suffused with Magic", "Tail Fighting", "Tireless", "Tzeentch's Blessing", "Vice (Alcohol)", "Vice (Pleasure)",
  "Whirlwind of Death", ...SUFFUSE_WINDS
];
