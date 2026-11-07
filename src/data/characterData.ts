import { CharacterClass, CharacterRace, ItemRarity, SignatureRelic } from '../types/character';

export const WORKBENCH_BACKGROUND = '/src/assets/images/alchemist_workbench_bg_1794032665937.jpg';

export const PAINTERLY_PORTRAITS: Record<CharacterClass, string[]> = {
  Warrior: ['/src/assets/images/fantasy_warrior_portrait_1794030146616.jpg'],
  Mage: ['/src/assets/images/fantasy_mage_portrait_1794030162239.jpg'],
  Rogue: ['/src/assets/images/fantasy_rogue_portrait_1794030161809.jpg'],
  Ranger: ['/src/assets/images/fantasy_ranger_portrait_1794030161700.jpg'],
  Cleric: ['/src/assets/images/fantasy_warrior_portrait_1794030146616.jpg'],
  Bard: ['/src/assets/images/fantasy_rogue_portrait_1794030161809.jpg'],
  Druid: ['/src/assets/images/fantasy_ranger_portrait_1794030161700.jpg'],
  Warlock: ['/src/assets/images/fantasy_mage_portrait_1794030162239.jpg'],
};

export const CARTOON_PORTRAITS: Record<CharacterClass, string[]> = {
  Warrior: [
    '/src/assets/images/cartoon_warrior_card_1794032664604.jpg',
    '/src/assets/images/cartoon_cleric_card_1794032682153.jpg',
  ],
  Mage: [
    '/src/assets/images/cartoon_mage_card_1794032664952.jpg',
    '/src/assets/images/cartoon_warrior_card_1794032664604.jpg',
  ],
  Rogue: [
    '/src/assets/images/cartoon_rogue_card_1794032666073.jpg',
    '/src/assets/images/cartoon_ranger_card_1794032681530.jpg',
  ],
  Ranger: [
    '/src/assets/images/cartoon_ranger_card_1794032681530.jpg',
    '/src/assets/images/cartoon_rogue_card_1794032666073.jpg',
  ],
  Cleric: [
    '/src/assets/images/cartoon_cleric_card_1794032682153.jpg',
    '/src/assets/images/cartoon_warrior_card_1794032664604.jpg',
  ],
  Bard: [
    '/src/assets/images/cartoon_mage_card_1794032664952.jpg',
    '/src/assets/images/cartoon_rogue_card_1794032666073.jpg',
  ],
  Druid: [
    '/src/assets/images/cartoon_ranger_card_1794032681530.jpg',
    '/src/assets/images/cartoon_cleric_card_1794032682153.jpg',
  ],
  Warlock: [
    '/src/assets/images/cartoon_mage_card_1794032664952.jpg',
    '/src/assets/images/cartoon_rogue_card_1794032666073.jpg',
  ],
};

export const CLASS_PORTRAITS: Record<CharacterClass, string> = {
  Warrior: '/src/assets/images/cartoon_warrior_card_1794032664604.jpg',
  Mage: '/src/assets/images/cartoon_mage_card_1794032664952.jpg',
  Rogue: '/src/assets/images/cartoon_rogue_card_1794032666073.jpg',
  Ranger: '/src/assets/images/cartoon_ranger_card_1794032681530.jpg',
  Cleric: '/src/assets/images/cartoon_cleric_card_1794032682153.jpg',
  Bard: '/src/assets/images/cartoon_mage_card_1794032664952.jpg',
  Druid: '/src/assets/images/cartoon_ranger_card_1794032681530.jpg',
  Warlock: '/src/assets/images/cartoon_mage_card_1794032664952.jpg',
};

export const CLASS_METADATA: Record<
  CharacterClass,
  {
    subclasses: string[];
    hitDie: number;
    primaryAttr: 'STR' | 'DEX' | 'INT' | 'WIS' | 'CHA' | 'CON';
    secondaryAttr: 'STR' | 'DEX' | 'INT' | 'WIS' | 'CHA' | 'CON';
    accentColor: string;
    description: string;
  }
> = {
  Warrior: {
    subclasses: ['Vanguard Knight', 'Blood Berserker', 'Ironclad Champion', 'Banneret Commander'],
    hitDie: 10,
    primaryAttr: 'STR',
    secondaryAttr: 'CON',
    accentColor: '#e11d48', // Crimson
    description: 'Masters of martial combat, resilient frontline defenders, and relentless combatants.',
  },
  Mage: {
    subclasses: ['Arcane Scholar', 'Pyromancer', 'Chronomancer', 'Frost Evoker', 'Void Theorist'],
    hitDie: 6,
    primaryAttr: 'INT',
    secondaryAttr: 'WIS',
    accentColor: '#3b82f6', // Sapphire Blue
    description: 'Scholars of reality-bending arcane forces who channel raw elemental weave.',
  },
  Rogue: {
    subclasses: ['Shadowblade', 'Phantom Infiltrator', 'Acrobatic Trickster', 'Whisper Assassin'],
    hitDie: 8,
    primaryAttr: 'DEX',
    secondaryAttr: 'CHA',
    accentColor: '#10b981', // Emerald Shadow
    description: 'Deadly opportunists who utilize speed, stealth, and critical precision strikes.',
  },
  Ranger: {
    subclasses: ['Gloom Hunter', 'Beastwarden', 'Horizon Scout', 'Deepwood Sentinel'],
    hitDie: 10,
    primaryAttr: 'DEX',
    secondaryAttr: 'WIS',
    accentColor: '#16a34a', // Forest Green
    description: 'Wilderness trackers and master marksmen at home between civilized lands and wild frontier.',
  },
  Cleric: {
    subclasses: ['Dawn Templar', 'Lifebringer', 'Grave Warden', 'Storm Inquisitor'],
    hitDie: 8,
    primaryAttr: 'WIS',
    secondaryAttr: 'STR',
    accentColor: '#f59e0b', // Radiant Amber
    description: 'Conduits of divine radiance who mend allies and purge darkness with holy fervour.',
  },
  Bard: {
    subclasses: ['College of Lore', 'Blade Troubadour', 'Whisper Chronicler', 'Skald of Heroes'],
    hitDie: 8,
    primaryAttr: 'CHA',
    secondaryAttr: 'DEX',
    accentColor: '#a855f7', // Mystic Purple
    description: 'Weavers of song and sorcery who manipulate morale, fate, and ancient legends.',
  },
  Druid: {
    subclasses: ['Circle of the Moon', 'Keeper of Ancient Oaks', 'Spore Shaman', 'Wildfire Weaver'],
    hitDie: 8,
    primaryAttr: 'WIS',
    secondaryAttr: 'CON',
    accentColor: '#059669', // Jade Earth
    description: 'Preservers of primal harmony capable of morphing into beasts and commanding roots.',
  },
  Warlock: {
    subclasses: ['Eldritch Pactbinder', 'Nether Fiend Blade', 'Starlight Cosmic Seeker', 'Hex Weaver'],
    hitDie: 8,
    primaryAttr: 'CHA',
    secondaryAttr: 'CON',
    accentColor: '#8b5cf6', // Violet Void
    description: 'Strikers bound by uncanny pacts with otherworldly entities of immense power.',
  },
};

export const RACE_DATA: Record<
  CharacterRace,
  {
    speed: number;
    statBonus: { attr: 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'; bonus: number };
    trait: string;
    names: string[];
  }
> = {
  Human: {
    speed: 30,
    statBonus: { attr: 'STR', bonus: 1 },
    trait: 'Versatile Resolve (+1 to all saves)',
    names: ['Alistair', 'Cassandra', 'Cedric', 'Genevieve', 'Galahad', 'Rowena', 'Mathias', 'Rosalind', 'Darius', 'Evelyn', 'Valerius', 'Elena'],
  },
  'High Elf': {
    speed: 30,
    statBonus: { attr: 'INT', bonus: 2 },
    trait: 'Fey Ancestry & Keen Senses',
    names: ['Thaelen', 'Sylphira', 'Elenor', 'Faelar', 'Aeloria', 'Caelynn', 'Illyrion', 'Vesperis', 'Naerith', 'Zephyrion', 'Lirien', 'Morwen'],
  },
  'Wood Elf': {
    speed: 35,
    statBonus: { attr: 'DEX', bonus: 2 },
    trait: 'Mask of the Wild (Flawless forest camouflage)',
    names: ['Thalor', 'Kaelen', 'Lyra', 'Tanis', 'Erryn', 'Baelor', 'Althaea', 'Farrin', 'Taelan', 'Sariel'],
  },
  'Mountain Dwarf': {
    speed: 25,
    statBonus: { attr: 'CON', bonus: 2 },
    trait: 'Dwarven Resilience & Stonecunning',
    names: ['Thorin', 'Balin', 'Morgrim', 'Duerga', 'Brondil', 'Kildrak', 'Hlin', 'Vondal', 'Helja', 'Dagran', 'Bofur', 'Gromli'],
  },
  Tiefling: {
    speed: 30,
    statBonus: { attr: 'CHA', bonus: 2 },
    trait: 'Hellfire Resistance & Darkvision',
    names: ['Malakor', 'Zephira', 'Ignatius', 'Kalista', 'Ravena', 'Mordred', 'Mephistia', 'Balthazar', 'Valafar', 'Seraphiel'],
  },
  Dragonborn: {
    speed: 30,
    statBonus: { attr: 'STR', bonus: 2 },
    trait: 'Draconic Breath Weapon & Damage Resistance',
    names: ['Balasar', 'Heskan', 'Kava', 'Medrash', 'Nadarr', 'Rhogar', 'Tarhun', 'Sora', 'Zarkon', 'Drakon', 'Ignis'],
  },
  Halfling: {
    speed: 25,
    statBonus: { attr: 'DEX', bonus: 2 },
    trait: 'Halfling Nimbleness & Lucky Reroll',
    names: ['Milo', 'Roscoe', 'Pip', 'Meriadoc', 'Callie', 'Bree', 'Eldon', 'Lavinia', 'Finnick', 'Corin', 'Tilly'],
  },
  'Half-Orc': {
    speed: 30,
    statBonus: { attr: 'STR', bonus: 2 },
    trait: 'Relentless Endurance & Savage Attacks',
    names: ['Grommash', 'Korag', 'Thorgar', 'Valka', 'Dench', 'Ront', 'Krusk', 'Mhurren', 'Brakka', 'Vorn'],
  },
  Aasimar: {
    speed: 30,
    statBonus: { attr: 'CHA', bonus: 2 },
    trait: 'Celestial Revelation & Radiant Soul',
    names: ['Aurelius', 'Seraphina', 'Castiel', 'Elysia', 'Solaria', 'Valen', 'Lucian', 'Celestine', 'Gariel', 'Oriana'],
  },
};

export const SURNAMES = [
  'Blackwood',
  'Stormcaller',
  'Dawnstrider',
  'Ironfist',
  'Nightshade',
  'Emberweaver',
  'Winterfell',
  'Silverpine',
  'Wyrmsbane',
  'Ravenshade',
  'Sunwalker',
  'Ashthorn',
  'Swiftstride',
  'Deepdelver',
  'Spellseeker',
  'Gloomweaver',
  'Starforge',
  'Frostmourn',
  'Oakenheart',
  'Runebreaker',
  'Shadowwhisper',
  'Thunderfall',
  'Crownshield',
  'Voidwatcher',
];

export const TITLES = [
  'the Resolute',
  'the Silent Blade',
  'Bane of Wyrms',
  'Keeper of Embers',
  'the Undefeated',
  'of the Whispering Pines',
  'the Spellbound',
  'the Ghost of Oakhaven',
  'Seeker of Starlight',
  'the Cursed',
  'Shield of the Valleys',
  'the Untamed',
  'Hand of the Eclipse',
  'Watcher of the Rifts',
  'the Ironborn',
  'Voice of the Ancients',
];

export const ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil',
];

export const BACKGROUND_ORIGINS = [
  'Disgraced knight searching for redemption after an unheeded oath.',
  'Hedge wizard apprentice who deciphered forbidden star charts in secret.',
  'Guild thief betrayed by a former partner during a midnight heist.',
  'Sole survivor of a cursed expedition into the Sunken Barrow.',
  'Hermit chosen by the Elder Oak spirit to walk among mortals again.',
  'Noble scion traveling incognito to escape an arranged political coronation.',
  'Former arena gladiator who bought freedom with a notched broadsword.',
  'Frontier cartographer mapping mysterious glowing leylines across uncharted crags.',
  'Temple archivist who witnessed an ancient marble statue whisper prophecies.',
  'Outlaw bounty hunter tracking an elusive shadow-mancer through winter valleys.',
  'Exiled elven diplomat bearing warning of an approaching abyssal rift.',
  'Shipwrecked sea-privateer marked by an abyssal kraken brand.',
];

export const PERSONALITY_TRAITS = [
  'Speaks in measured, quiet sentences and watches the perimeter closely.',
  'Fiercely protective of companions, never letting anyone walk alone.',
  'Insatiably curious about forgotten runes and forbidden histories.',
  'Masks dread with sarcastic humor and high-stakes wagers.',
  'Honors every promise made, even when it demands great peril.',
  'Prefers sleeping under open stars rather than inside stone tavern walls.',
  'Always inspects doorways twice for concealed runes or tripwires.',
  'Collects polished stones from every battlefield survived.',
];

export const FLAWS_AND_QUIRKS = [
  'Compulsively counts cobblestones or stairs when nervous.',
  'Cannot resist inspecting locked chests or sealed envelopes.',
  'Never declines a direct challenge to martial strength or cunning.',
  'Possesses a terrible secret that could bring ruin if revealed.',
  'Deeply superstitious about crows, ravens, and eclipse moons.',
  'Carries an ancient brass key that opens no known door.',
  'Quick to trust those who offer hot food and spiced cider.',
  'Speaks out loud to an invisible childhood guardian spirit.',
];

export const QUESTS_AND_GOALS = [
  'Locate the shattered shards of an ancestral sunblade.',
  'Avenge a slaughtered mentor slain by a masked sorcerer.',
  'Find a cure for a creeping crystalline curse spreading up the left forearm.',
  'Decipher an obsidian tablet recovered from an underground sunken ziggurat.',
  'Repay a blood-debt owed to a mysterious patron in the Under-City.',
  'Establish a sanctuary for refugees from the scorched northern plains.',
  'Track down an elven artifact before it falls into imperial inquisitor hands.',
];

export const CLASS_EQUIPMENT: Record<
  CharacterClass,
  {
    weapons: string[];
    armors: string[];
    gearSets: string[][];
  }
> = {
  Warrior: {
    weapons: ['Bastard Greatsword', 'Warhammer & Kite Shield', 'Twin Broadswords', 'Heavy Poleaxe'],
    armors: ['Etched Plate Mail', 'Hardened Scale Cuirass', 'Riveted Chain Hauberk'],
    gearSets: [
      ['Whetstone', 'Iron Grappling Hook', '50ft Hemp Rope', 'Rations (5 days)'],
      ['Torches (x3)', 'Flask of Oil', 'Tinderbox', 'Silver Dagger'],
      ['Traveler Cloak', 'Iron Rations', 'Steel Flask', 'Crowbar'],
    ],
  },
  Mage: {
    weapons: ['Starlight Crystal Staff', 'Carved Yew Wand & Tome', 'Enchanted Runed Dagger', 'Orb of Arcane Frost'],
    armors: ['Embroidered Silk Vestments', 'Rune-Woven Scholar Robes', 'Padded Velveteen Tunic'],
    gearSets: [
      ['Ink & Quill', 'Blank Parchment Rolls', 'Spellbook', 'Component Pouch'],
      ['Focusing Prism', 'Hourglass', 'Herbal Incense', 'Brass Astrolabe'],
      ['Chalk & Salt', 'Vials of Quicksilver', 'Sealing Wax', 'Scholar Spectacles'],
    ],
  },
  Rogue: {
    weapons: ['Twin Venom Daggers', 'Light Crossbow & Quiver', 'Engraved Rapier', 'Serrated Shortsword'],
    armors: ['Supple Midnight Leather', 'Studded Brigandine', 'Dark Silk Jerkin'],
    gearSets: [
      ['Master Thieves’ Tools', 'Spool of Silk Cord', 'Caltrops', 'Vial of Nightshade'],
      ['Disguise Kit', 'Concealed Lockpick', 'Flash Pellet', 'Deck of Marked Cards'],
      ['Climbing Spikes', 'Smoked Glass Goggles', 'Iron Chalk', 'Throwing Knives (x4)'],
    ],
  },
  Ranger: {
    weapons: ['Composite Yew Longbow', 'Dual Hunting Scramasaxes', 'Heavy Recurve Bow', 'Spear & Hatchet'],
    armors: ['Hardened Boar-Hide Armor', 'Camouflage Leaf Cloak & Leather', 'Reinforced Ranger Vest'],
    gearSets: [
      ['Quiver of 20 Broadhead Arrows', 'Hunting Snare Wire', 'Herbalist Poultice', 'Felt Bedroll'],
      ['Signal Whistle', 'Skin of Mountain Water', 'Survival Hatchet', 'Map of Frontier'],
      ['Fire-starter Striker', 'Carving Knife', 'Scent-Masking Musk', 'Telescope'],
    ],
  },
  Cleric: {
    weapons: ['Flanged Heavy Mace', 'Gilded Morningstar & Shield', 'Sun-Forged Warhammer', 'Sacred Censer Flail'],
    armors: ['Blessed Chainmail', 'Sanctified Half-Plate', 'Ceremonial Cleric Surcoat'],
    gearSets: [
      ['Silver Holy Symbol', 'Vial of Blessed Water', 'Healer’s Salve Kit', 'Prayer Beads'],
      ['Incense Censer', 'Scripture Scroll', 'Healing Balm', 'Sunfire Candle'],
      ['Anointing Oil', 'Bronze Reliquary', 'Bandages', 'Alms Pouch'],
    ],
  },
  Bard: {
    weapons: ['Ornate Fencing Foil', 'Silver-Strung Lute & Dirk', 'Duelist Rapier', 'Hand Crossbow'],
    armors: ['Tailored Velvet Doublet', 'Embroidered Boiled Leather', 'Feathered Harlequin Garb'],
    gearSets: [
      ['Fine Instrument', 'Costume Wardrobe', 'Flagon of Fine Wine', 'Perfume Vial'],
      ['Songbook of Ballads', 'Disguise Pigments', 'Deck of Cards', 'Silver Mirror'],
      ['Pouch of Copper Counters', 'Wax-Sealed Letters', 'Jester Bells', 'Lute Picks'],
    ],
  },
  Druid: {
    weapons: ['Gnarled Ironwood Club', 'Scythe of Thorns', 'Quarterstaff of the Wilds', 'Bone Dagger'],
    armors: ['Bark-Hardened Armor', 'Hide Tunic with Antler Trim', 'Living Ivy Garments'],
    gearSets: [
      ['Herbalism Pouch', 'Sprig of Mistletoe', 'Beast Totem Carving', 'Gourd of Spring Water'],
      ['Bag of Rare Seeds', 'Dowsing Rod', 'Preserved Honeycomb', 'Feather Charm'],
      ['Bone Flute', 'Mortar & Pestle', 'Pouch of Dried Moss', 'Wild Berry Rations'],
    ],
  },
  Warlock: {
    weapons: ['Pact-Bound Glaive', 'Obsidian Ritual Athame', 'Eldritch Rod of Nether', 'Spine Flail'],
    armors: ['Runed Leather Jerkin', 'Occult Velvet Mantle', 'Shadow-Stitched Vestments'],
    gearSets: [
      ['Pact Tome with Chained Clasp', 'Lodestone', 'Black Wax Candle', 'Vial of Blood Incense'],
      ['Cursed Coin that Always Returns', 'Eldritch Mirror', 'Sulfur Powder', 'Bone Dice'],
      ['Raven Skull Talisman', 'Torn Spell Slip', 'Shadow Lantern', 'Silver Bell'],
    ],
  },
};

export const SIGNATURE_RELICS: SignatureRelic[] = [
  {
    name: 'Eye of the Void Watcher',
    rarity: 'Legendary',
    lore: 'A petrified iris of an ancient astral beast that twitches when lies are spoken.',
    effect: '+2 to Initiative; grants true-sight within 15 paces in absolute darkness.',
  },
  {
    name: 'Dawnshard Pendant',
    rarity: 'Rare',
    lore: 'Warm to the touch, this amber crystal holds the first ray of dawn trapped inside.',
    effect: 'Emits gentle sunlight on command; once per day, dispels blinding or fear effects.',
  },
  {
    name: 'Shadow-Tether Ring',
    rarity: 'Epic',
    lore: 'Forged in the fathomless depths by rogue illusionists of the Under-Spire.',
    effect: 'Allows the bearer to instantly swap places with their shadow up to 30 feet away.',
  },
  {
    name: 'Ancestral Horn of the Crags',
    rarity: 'Rare',
    lore: 'Carved from the horn of a legendary woolly wyrm that guarded mountain passes.',
    effect: 'When blown, bolsters all allies within hearing with +5 Temporary Hit Points.',
  },
  {
    name: 'Weaver’s Thread of Fate',
    rarity: 'Uncommon',
    lore: 'A shimmering strand of iridescent spun silver that never frays or breaks.',
    effect: 'Allows rerolling one critical failure or catastrophic roll once per long rest.',
  },
  {
    name: 'Chalice of the Living Spring',
    rarity: 'Epic',
    lore: 'Crafted by the first circle of dryads before the great forest burned.',
    effect: 'Any water poured into this vessel purifies poison and heals 2d8 damage.',
  },
  {
    name: 'Whispering Soul Coin',
    rarity: 'Uncommon',
    lore: 'Minted in the infernal forge; when placed to the ear, it mutters secrets of passersby.',
    effect: 'Grants +2 to Insight and Perception checks when held tightly in the palm.',
  },
  {
    name: 'Frostbite Talisman of Jötunheim',
    rarity: 'Rare',
    lore: 'An ice crystal that never melts, salvaged from a glacier throne.',
    effect: 'Attacks deal an additional 1d6 Cold damage and coat the target in frost.',
  },
  {
    name: 'Aegis Brooch of the Valiant',
    rarity: 'Uncommon',
    lore: 'Bestowed upon squires who held the breach until dawn during the Siege of Oakhaven.',
    effect: '+1 to Armor Class when fighting defensively alongside an ally.',
  },
  {
    name: 'Crown of the Sunken Sovereign',
    rarity: 'Legendary',
    lore: 'Recovered from the seabed vaults of an empire swallowed by tidal sorcery.',
    effect: 'Enables water breathing, command over aquatic tides, and resistance to lightning.',
  },
];

export function generateUniqueBackstory(
  name: string,
  charClass: CharacterClass,
  race: CharacterRace,
  subclass: string,
  alignment: string
): string {
  const hooks = [
    `Found wandering the glowing perimeter of the Sunken Barrow as a young ${race}, ${name} unlocked latent powers through an ancient alchemical crucible.`,
    `After an unsanctioned experiment within the Alchemist Guild's secret sanctum, ${name} was cast into the frontier with nothing but an enchanted focus and unyielding resolve.`,
    `Trained from youth under the austere masters of the Silver Citadel, ${name} chose to renounce noble birthrights in pursuit of forbidden alchemical truths.`,
    `Once a celebrated vanguard of the northern frontier bastions, a sudden celestial eclipse awakened an uncanny ancestral mantle within ${name}'s bloodline.`,
    `Driven into hiding when shadowy mercenaries torched their ancestral guildhall, ${name} swore an oath to reclaim the stolen secrets of their house.`,
    `Marked by the spirit of the whispering woods during an unnatural blood moon, ${name} survived where entire caravans had vanished without a trace.`,
    `Having deciphered a crumbling brass codex salvaged from an underwater ziggurat, ${name} discovered that their lineage carries an eternal destiny.`,
  ];

  const resolutions = [
    `Now fighting as a renowned ${subclass}, they venture through perilous dungeons to restore equilibrium to the realm.`,
    `Bearing the mantle of a ${subclass}, they seek the mythical Sunken Shards before shadow-mancers plunge the kingdom into eternal night.`,
    `Armed with the martial instincts of a ${subclass}, they roam the frontier crags defending the downtrodden with unwavering courage.`,
    `Guided by the convictions of a ${alignment} warrior, they wield their talents to decipher forgotten runes and vanquish creeping abominations.`,
    `Embracing the path of the ${subclass}, their legendary presence and quick wits turn the tide in the darkest hours of battle.`,
  ];

  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const resolution = resolutions[Math.floor(Math.random() * resolutions.length)];
  return `${hook} ${resolution}`;
}

