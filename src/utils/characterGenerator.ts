import {
  Character,
  CharacterClass,
  CharacterRace,
  AttributeName,
  Equipment,
  SignatureRelic,
} from '../types/character';
import {
  CLASS_METADATA,
  CLASS_PORTRAITS,
  RACE_DATA,
  SURNAMES,
  TITLES,
  ALIGNMENTS,
  BACKGROUND_ORIGINS,
  PERSONALITY_TRAITS,
  FLAWS_AND_QUIRKS,
  QUESTS_AND_GOALS,
  CLASS_EQUIPMENT,
  SIGNATURE_RELICS,
  CARTOON_PORTRAITS,
  generateUniqueBackstory,
} from '../data/characterData';

function getRandomItem<T>(items: readonly T[] | T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 4d6 drop lowest roll simulation for authentic tabletop feel
function roll4d6DropLowest(): number {
  const rolls = [getRandomInt(1, 6), getRandomInt(1, 6), getRandomInt(1, 6), getRandomInt(1, 6)];
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function generateAttributes(
  charClass: CharacterClass,
  charRace: CharacterRace
): { attributes: Record<AttributeName, number>; modifiers: Record<AttributeName, number> } {
  const meta = CLASS_METADATA[charClass];
  const raceInfo = RACE_DATA[charRace];

  // Roll 6 stats
  const rolls = [
    roll4d6DropLowest(),
    roll4d6DropLowest(),
    roll4d6DropLowest(),
    roll4d6DropLowest(),
    roll4d6DropLowest(),
    roll4d6DropLowest(),
  ];
  rolls.sort((a, b) => b - a); // descending order

  const statAssignment: Record<AttributeName, number> = {
    STR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    WIS: 10,
    CHA: 10,
  };

  // Best roll goes to primary class attribute, second to secondary
  statAssignment[meta.primaryAttr] = rolls[0];
  statAssignment[meta.secondaryAttr] = rolls[1];

  // Assign remaining attributes
  const remainingAttrs: AttributeName[] = (['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as AttributeName[]).filter(
    (attr) => attr !== meta.primaryAttr && attr !== meta.secondaryAttr
  );

  for (let i = 0; i < remainingAttrs.length; i++) {
    statAssignment[remainingAttrs[i]] = rolls[2 + i];
  }

  // Apply racial bonus
  if (raceInfo && raceInfo.statBonus) {
    statAssignment[raceInfo.statBonus.attr] += raceInfo.statBonus.bonus;
  }

  // Calculate modifiers
  const modifiers: Record<AttributeName, number> = {
    STR: calculateModifier(statAssignment.STR),
    DEX: calculateModifier(statAssignment.DEX),
    CON: calculateModifier(statAssignment.CON),
    INT: calculateModifier(statAssignment.INT),
    WIS: calculateModifier(statAssignment.WIS),
    CHA: calculateModifier(statAssignment.CHA),
  };

  return { attributes: statAssignment, modifiers };
}

export function generateEquipment(charClass: CharacterClass): Equipment {
  const classGear = CLASS_EQUIPMENT[charClass];
  const relic = getRandomItem(SIGNATURE_RELICS);

  return {
    weapon: getRandomItem(classGear.weapons),
    armor: getRandomItem(classGear.armors),
    gear: getRandomItem(classGear.gearSets),
    signatureRelic: relic,
  };
}

export function generateName(race: CharacterRace): { name: string; title: string } {
  const raceInfo = RACE_DATA[race];
  const firstName = getRandomItem(raceInfo.names);
  const surname = getRandomItem(SURNAMES);
  const title = getRandomItem(TITLES);

  // 40% chance name has a surname, 60% chance first + surname
  const hasSurname = Math.random() > 0.15;
  const fullName = hasSurname ? `${firstName} ${surname}` : firstName;

  return { name: fullName, title };
}

export function generateRandomCharacter(options?: {
  preferredClass?: CharacterClass;
  preferredRace?: CharacterRace;
  level?: number;
}): Character {
  const allClasses: CharacterClass[] = [
    'Warrior',
    'Mage',
    'Rogue',
    'Ranger',
    'Cleric',
    'Bard',
    'Druid',
    'Warlock',
  ];
  const allRaces: CharacterRace[] = [
    'Human',
    'High Elf',
    'Wood Elf',
    'Mountain Dwarf',
    'Tiefling',
    'Dragonborn',
    'Halfling',
    'Half-Orc',
    'Aasimar',
  ];

  const charClass = options?.preferredClass || getRandomItem(allClasses);
  const charRace = options?.preferredRace || getRandomItem(allRaces);
  const level = options?.level ?? 1;

  const meta = CLASS_METADATA[charClass];
  const raceInfo = RACE_DATA[charRace];
  const { name, title } = generateName(charRace);
  const { attributes, modifiers } = generateAttributes(charClass, charRace);
  const equipment = generateEquipment(charClass);

  // Compute calculated combat stats
  const conMod = modifiers.CON;
  const dexMod = modifiers.DEX;

  // Level 1 HP = Max Hit Die + CON Mod
  // Higher level HP scales per level
  const baseHp = meta.hitDie + conMod;
  const perLevelHp = Math.max(1, Math.floor(meta.hitDie / 2) + 1 + conMod);
  const maxHp = Math.max(1, baseHp + (level - 1) * perLevelHp);

  // Mana/Stamina
  const isCaster = ['Mage', 'Cleric', 'Druid', 'Warlock', 'Bard'].includes(charClass);
  const mentalMod = Math.max(modifiers.INT, modifiers.WIS, modifiers.CHA);
  const mana = isCaster ? Math.max(10, level * 8 + mentalMod * 3 + 12) : Math.max(5, level * 4 + modifiers.STR * 2 + 10);

  // Armor Class
  let baseAc = 11;
  if (charClass === 'Warrior' || charClass === 'Cleric') {
    baseAc = 16 + Math.min(dexMod, 1); // Heavy or medium with shield
  } else if (charClass === 'Rogue' || charClass === 'Ranger') {
    baseAc = 12 + dexMod; // Light leather
  } else {
    baseAc = 10 + dexMod; // Cloth/vestments
  }

  const speed = raceInfo.speed;
  const initiative = dexMod;

  // Specific player card stats requested:
  // Health: 50-100, Mana: 20-100, Strength: 10-50
  const randomHealth = getRandomInt(50, 100);
  const randomMana = getRandomInt(20, 100);
  const randomStrength = getRandomInt(10, 50);

  // Sync Strength in attributes
  attributes.STR = randomStrength;
  modifiers.STR = calculateModifier(randomStrength);

  const portraitUrl = CLASS_PORTRAITS[charClass];

  return {
    id: `char_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    title,
    class: charClass,
    subclass: getRandomItem(meta.subclasses),
    race: charRace,
    level,
    alignment: getRandomItem(ALIGNMENTS),
    attributes,
    modifiers,
    health: randomHealth,
    mana: randomMana,
    strength: randomStrength,
    hp: randomHealth,
    maxHp: randomHealth,
    armorClass: baseAc,
    speed,
    initiative,
    background: getRandomItem(BACKGROUND_ORIGINS),
    backstory: generateUniqueBackstory(
      name,
      charClass,
      charRace,
      getRandomItem(meta.subclasses),
      getRandomItem(ALIGNMENTS)
    ),
    personalityTrait: getRandomItem(PERSONALITY_TRAITS),
    flawOrQuirk: getRandomItem(FLAWS_AND_QUIRKS),
    questOrGoal: getRandomItem(QUESTS_AND_GOALS),
    equipment,
    portraitUrl: CARTOON_PORTRAITS[charClass]?.[0] || portraitUrl,
    portraitStyle: 'cartoon',
    portraitIndex: 0,
    createdAt: new Date().toISOString(),
  };
}

export function formatCharacterMarkdown(char: Character): string {
  return `# ${char.name}, ${char.title}
*Level ${char.level} ${char.race} ${char.subclass} (${char.class})*
**Alignment:** ${char.alignment} · **Speed:** ${char.speed} ft · **Initiative:** ${formatModifier(char.initiative)}

---

## Combat Attributes
- **HP (Health Points):** ${char.hp} / ${char.maxHp}
- **Mana / Stamina:** ${char.mana}
- **Armor Class (AC):** ${char.armorClass}
- **Speed:** ${char.speed} ft / round
- **Initiative Modifier:** ${formatModifier(char.initiative)}

## Ability Scores
| Attribute | Score | Modifier |
| :--- | :---: | :---: |
| **Strength (STR)** | ${char.attributes.STR} | ${formatModifier(char.modifiers.STR)} |
| **Dexterity (DEX)** | ${char.attributes.DEX} | ${formatModifier(char.modifiers.DEX)} |
| **Constitution (CON)** | ${char.attributes.CON} | ${formatModifier(char.modifiers.CON)} |
| **Intelligence (INT)** | ${char.attributes.INT} | ${formatModifier(char.modifiers.INT)} |
| **Wisdom (WIS)** | ${char.attributes.WIS} | ${formatModifier(char.modifiers.WIS)} |
| **Charisma (CHA)** | ${char.attributes.CHA} | ${formatModifier(char.modifiers.CHA)} |

## Equipment & Armaments
- **Primary Weapon:** ${char.equipment.weapon}
- **Armor & Attire:** ${char.equipment.armor}
- **Adventuring Kit:** ${char.equipment.gear.join(', ')}

### Signature Relic: ${char.equipment.signatureRelic.name}
- **Rarity:** ${char.equipment.signatureRelic.rarity}
- **Lore:** *"${char.equipment.signatureRelic.lore}"*
- **Relic Effect:** ${char.equipment.signatureRelic.effect}

## Background & Narrative Lore
- **Origin & Lineage Heritage:** ${char.background}
- **Backstory:** ${char.backstory}
- **Defining Personality Trait:** ${char.personalityTrait}
- **Fatal Flaw / Notable Quirk:** ${char.flawOrQuirk}
- **Current Calling & Quest:** ${char.questOrGoal}

---
*Generated by RealmForge Character Creator*
`;
}

export function formatCharacterPlainText(char: Character): string {
  const line = '═'.repeat(60);
  const subline = '─'.repeat(60);
  return `${line}
REALMFORGE FANTASY CHARACTER DOSSIER
${line}
NAME:       ${char.name}
TITLE:      ${char.title}
CLASS:      ${char.class} (${char.subclass})
LINEAGE:    ${char.race}
LEVEL:      Level ${char.level}
ALIGNMENT:  ${char.alignment}

${subline}
COMBAT VITALS
${subline}
Hit Points (HP):   ${char.hp} / ${char.maxHp}
Mana / Stamina:    ${char.mana} pts
Armor Class (AC):  ${char.armorClass}
Initiative:        ${formatModifier(char.initiative)}
Speed:             ${char.speed} ft / round

${subline}
ABILITY SCORES & MODIFIERS
${subline}
STR:  ${char.attributes.STR.toString().padEnd(2)}  [${formatModifier(char.modifiers.STR)}]    INT:  ${char.attributes.INT.toString().padEnd(2)}  [${formatModifier(char.modifiers.INT)}]
DEX:  ${char.attributes.DEX.toString().padEnd(2)}  [${formatModifier(char.modifiers.DEX)}]    WIS:  ${char.attributes.WIS.toString().padEnd(2)}  [${formatModifier(char.modifiers.WIS)}]
CON:  ${char.attributes.CON.toString().padEnd(2)}  [${formatModifier(char.modifiers.CON)}]    CHA:  ${char.attributes.CHA.toString().padEnd(2)}  [${formatModifier(char.modifiers.CHA)}]

${subline}
ARMAMENTS & EQUIPMENT
${subline}
Primary Weapon:   ${char.equipment.weapon}
Armor / Attire:   ${char.equipment.armor}
Adventuring Kit:  ${char.equipment.gear.join(', ')}

Signature Relic:  ${char.equipment.signatureRelic.name} [${char.equipment.signatureRelic.rarity}]
  Lore:   "${char.equipment.signatureRelic.lore}"
  Effect: ${char.equipment.signatureRelic.effect}

${subline}
BACKGROUND & NARRATIVE LORE
${subline}
Origin:    ${char.background}
Backstory: ${char.backstory}
Trait:     ${char.personalityTrait}
Flaw:      ${char.flawOrQuirk}
Quest:     ${char.questOrGoal}

${line}
Generated with RealmForge
${line}`;
}

export function downloadCharacterFile(char: Character, format: 'markdown' | 'text'): string {
  const isMd = format === 'markdown';
  const content = isMd ? formatCharacterMarkdown(char) : formatCharacterPlainText(char);
  const mimeType = isMd ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
  const extension = isMd ? 'md' : 'txt';
  const safeName =
    char.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'character';
  const filename = `${safeName}_lvl${char.level}_${char.class.toLowerCase()}.${extension}`;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return filename;
}
