export type CharacterClass =
  | 'Warrior'
  | 'Mage'
  | 'Rogue'
  | 'Ranger'
  | 'Cleric'
  | 'Bard'
  | 'Druid'
  | 'Warlock';

export type CharacterRace =
  | 'Human'
  | 'High Elf'
  | 'Wood Elf'
  | 'Mountain Dwarf'
  | 'Tiefling'
  | 'Dragonborn'
  | 'Halfling'
  | 'Half-Orc'
  | 'Aasimar';

export type AttributeName = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export interface SignatureRelic {
  name: string;
  rarity: ItemRarity;
  lore: string;
  effect: string;
}

export interface Equipment {
  weapon: string;
  armor: string;
  gear: string[];
  signatureRelic: SignatureRelic;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  class: CharacterClass;
  subclass: string;
  race: CharacterRace;
  level: number;
  alignment: string;
  attributes: Record<AttributeName, number>;
  modifiers: Record<AttributeName, number>;
  health: number; // 50-100
  mana: number; // 20-100
  strength: number; // 10-50
  hp: number;
  maxHp: number;
  armorClass: number;
  speed: number;
  initiative: number;
  background: string;
  backstory: string;
  personalityTrait: string;
  flawOrQuirk: string;
  questOrGoal: string;
  equipment: Equipment;
  portraitUrl: string;
  portraitStyle: 'cartoon' | 'painterly';
  portraitIndex: number;
  createdAt: string;
  notes?: string;
}

