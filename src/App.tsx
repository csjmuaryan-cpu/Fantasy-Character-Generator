import React, { useState, useEffect, useCallback } from 'react';
import { Character, CharacterClass, CharacterRace } from './types/character';
import {
  generateRandomCharacter,
  generateName,
  generateAttributes,
  generateEquipment,
} from './utils/characterGenerator';
import {
  BACKGROUND_ORIGINS,
  PERSONALITY_TRAITS,
  FLAWS_AND_QUIRKS,
  QUESTS_AND_GOALS,
  CLASS_METADATA,
  CARTOON_PORTRAITS,
  generateUniqueBackstory,
  WORKBENCH_BACKGROUND,
} from './data/characterData';
import { soundFX } from './utils/soundEffects';
import { saveCharacterToGoogleDrive, saveDeckToGoogleDrive } from './utils/googleDriveIntegration';
import { TopBar } from './components/TopBar';
import { GeneratorControls } from './components/GeneratorControls';
import { PlayerCard } from './components/PlayerCard';
import { MyDeckList } from './components/MyDeckList';
import { CharacterVault } from './components/CharacterVault';
import { Sparkles, Layers, Cloud } from 'lucide-react';

const DECK_STORAGE_KEY = 'realmforge_my_deck_v1';
const MUTE_KEY = 'realmforge_is_muted';

export default function App() {
  const [character, setCharacter] = useState<Character>(() =>
    generateRandomCharacter({ preferredClass: 'Warrior', level: 1 })
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | 'RANDOM'>('RANDOM');
  const [selectedRace, setSelectedRace] = useState<CharacterRace | 'RANDOM'>('RANDOM');
  const [level, setLevel] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // "My Deck" list state (persisted to localStorage)
  const [deck, setDeck] = useState<Character[]>(() => {
    try {
      const data = localStorage.getItem(DECK_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync mute state with sound controller
  useEffect(() => {
    soundFX.setMuted(isMuted);
    try {
      localStorage.setItem(MUTE_KEY, isMuted ? 'true' : 'false');
    } catch {
      // localStorage fallback
    }
  }, [isMuted]);

  // Persist "My Deck" list
  useEffect(() => {
    try {
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
    } catch {
      // localStorage fallback
    }
  }, [deck]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const handleGenerateCharacter = useCallback(() => {
    if (isGenerating) return;
    setIsGenerating(true);
    soundFX.playGenerateSound();

    setTimeout(() => {
      const newChar = generateRandomCharacter({
        preferredClass: selectedClass === 'RANDOM' ? undefined : selectedClass,
        preferredRace: selectedRace === 'RANDOM' ? undefined : selectedRace,
        level,
      });
      setCharacter(newChar);
      setIsGenerating(false);
    }, 180);
  }, [isGenerating, selectedClass, selectedRace, level]);

  // Keyboard shortcut listener (Space or G to roll, unless focusing an input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl instanceof HTMLSelectElement;

      if (!isInput) {
        if (e.code === 'Space' || e.key === 'g' || e.key === 'G') {
          e.preventDefault();
          handleGenerateCharacter();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerateCharacter]);

  // Update level and recalibrate stats
  const handleChangeLevel = (newLevel: number) => {
    soundFX.playClickSound();
    setLevel(newLevel);
    setCharacter((prev) => {
      const meta = CLASS_METADATA[prev.class];
      const conMod = prev.modifiers.CON;
      const baseHp = meta.hitDie + conMod;
      const perLevelHp = Math.max(1, Math.floor(meta.hitDie / 2) + 1 + conMod);
      const newMaxHp = Math.max(1, baseHp + (newLevel - 1) * perLevelHp);

      const isCaster = ['Mage', 'Cleric', 'Druid', 'Warlock', 'Bard'].includes(prev.class);
      const mentalMod = Math.max(prev.modifiers.INT, prev.modifiers.WIS, prev.modifiers.CHA);
      const newMana = isCaster
        ? Math.max(10, newLevel * 8 + mentalMod * 3 + 12)
        : Math.max(5, newLevel * 4 + prev.modifiers.STR * 2 + 10);

      return {
        ...prev,
        level: newLevel,
        hp: newMaxHp,
        maxHp: newMaxHp,
        mana: newMana,
      };
    });
  };

  // 1. CARTOON PORTRAIT GENERATE / REGENERATE (MANDATORY REQUIREMENT)
  const handleGenerateCartoonPortrait = () => {
    const portraits = CARTOON_PORTRAITS[character.class] || [];
    const nextUrl = portraits[0] || character.portraitUrl;
    setCharacter((prev) => ({
      ...prev,
      portraitUrl: nextUrl,
      portraitStyle: 'cartoon',
      portraitIndex: 0,
    }));
    showToast(`Generated cartoon video game portrait for ${character.name}`);
  };

  const handleRegenerateCartoonPortrait = () => {
    const portraits = CARTOON_PORTRAITS[character.class] || [];
    if (portraits.length === 0) return;
    const nextIdx = ((character.portraitIndex ?? 0) + 1) % portraits.length;
    const nextUrl = portraits[nextIdx];
    setCharacter((prev) => ({
      ...prev,
      portraitUrl: nextUrl,
      portraitStyle: 'cartoon',
      portraitIndex: nextIdx,
    }));
    showToast(`Regenerated portrait art (Style variant #${nextIdx + 1})`);
  };

  // 2. GENERATE BACKSTORY (MANDATORY REQUIREMENT: 1-2 sentence origin story)
  const handleGenerateBackstory = () => {
    const newBackstory = generateUniqueBackstory(
      character.name,
      character.class,
      character.race,
      character.subclass,
      character.alignment
    );
    setCharacter((prev) => ({ ...prev, backstory: newBackstory }));
    showToast('Generated unique 2-sentence origin backstory!');
  };

  // 3. STAT REROLL: Health (50-100), Mana (20-100), and Strength (10-50)
  const handleRerollStats = () => {
    const { attributes, modifiers } = generateAttributes(character.class, character.race);
    const newHealth = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
    const newMana = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
    const newStrength = Math.floor(Math.random() * (50 - 10 + 1)) + 10;

    attributes.STR = newStrength;
    modifiers.STR = Math.floor((newStrength - 10) / 2);

    setCharacter((prev) => ({
      ...prev,
      attributes,
      modifiers,
      health: newHealth,
      mana: newMana,
      strength: newStrength,
      hp: newHealth,
      maxHp: newHealth,
    }));
    showToast(`Rerolled: Health ${newHealth}, Mana ${newMana}, Strength ${newStrength}`);
  };

  // 4. SAVE TO DECK & "MY DECK" LIST (MANDATORY REQUIREMENT)
  const handleSaveToDeck = (char: Character) => {
    const exists = deck.some((c) => c.id === char.id);
    if (exists) {
      setDeck((prev) => prev.filter((c) => c.id !== char.id));
      showToast(`${char.name} removed from My Deck`);
    } else {
      setDeck((prev) => [char, ...prev]);
      showToast(`Added ${char.name} to My Deck!`);
    }
  };

  const handleRemoveFromDeck = (id: string) => {
    setDeck((prev) => prev.filter((c) => c.id !== id));
    showToast('Card removed from My Deck');
  };

  // 5. GOOGLE DRIVE INTEGRATION
  const handleSaveCharacterToGoogleDrive = (char: Character) => {
    const { filename } = saveCharacterToGoogleDrive(char);
    showToast(`Character card (${filename}) saved for Google Drive! Opening Drive...`);
  };

  const handleSaveDeckToGoogleDrive = () => {
    if (deck.length === 0) return;
    const { filename, count } = saveDeckToGoogleDrive(deck);
    showToast(`Saved ${count} deck cards (${filename}) for Google Drive!`);
  };

  const handleExportDeckJson = () => {
    soundFX.playClickSound();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(deck, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `realmforge_my_deck_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported My Deck as JSON file');
  };

  const handleRerollName = () => {
    const { name, title } = generateName(character.race);
    setCharacter((prev) => ({ ...prev, name, title }));
    showToast(`Name rerolled to ${name}`);
  };

  const isSavedInDeck = deck.some((c) => c.id === character.id);

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col relative selection:bg-amber-500 selection:text-slate-950"
      style={{
        backgroundColor: '#0c0a0c',
        backgroundImage: `radial-gradient(ellipse at top, rgba(120, 53, 15, 0.25) 0%, rgba(10, 8, 10, 0.95) 70%), url(${WORKBENCH_BACKGROUND})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Alchemist Workbench Ambient Texture Scrim */}
      <div className="absolute inset-0 bg-[#0a080a]/85 backdrop-blur-[2px] pointer-events-none" />

      {/* Top Navigation */}
      <TopBar
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        vaultCount={deck.length}
        onOpenVault={() => setIsVaultOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Ancient Alchemist Workbench Header Title Lockup */}
        <section className="text-center max-w-3xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-bold">
            <Sparkles className="h-4 w-4" />
            <span style={{ fontFamily: "'MedievalSharp', serif" }}>Ancient Alchemist’s Workbench</span>
            <Sparkles className="h-4 w-4" />
          </div>

          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-400 drop-shadow-xl"
            style={{ fontFamily: "'MedievalSharp', 'Cinzel Decorative', cursive, serif" }}
          >
            RealmForge Character Creator
          </h1>

          <p
            className="text-sm sm:text-base text-amber-200/70 leading-relaxed italic"
            style={{ fontFamily: "'MedievalSharp', 'Cinzel', serif" }}
          >
            Transmute raw elements into legendary heroes upon the ancient alchemist’s table.
          </p>
        </section>

        {/* Generator Main Controls Hub */}
        <GeneratorControls
          onGenerate={handleGenerateCharacter}
          isGenerating={isGenerating}
          selectedClass={selectedClass}
          onSelectClass={setSelectedClass}
          selectedRace={selectedRace}
          onSelectRace={setSelectedRace}
          level={level}
          onChangeLevel={handleChangeLevel}
        />

        {/* BORDERED PLAYER CARD (MANDATORY REQUIREMENT) */}
        <PlayerCard
          character={character}
          onGenerateCartoonPortrait={handleGenerateCartoonPortrait}
          onRegenerateCartoonPortrait={handleRegenerateCartoonPortrait}
          onGenerateBackstory={handleGenerateBackstory}
          onSaveToDeck={handleSaveToDeck}
          isSavedInDeck={isSavedInDeck}
          onRerollStats={handleRerollStats}
          onRerollName={handleRerollName}
          onUpdateCharacterName={(newName) => {
            setCharacter((prev) => ({ ...prev, name: newName }));
            showToast(`Character renamed to ${newName}`);
          }}
          onToast={showToast}
          onSaveToGoogleDrive={handleSaveCharacterToGoogleDrive}
        />

        {/* "MY DECK" LIST DISPLAYED WITHIN THE APP (MANDATORY REQUIREMENT) */}
        <MyDeckList
          deck={deck}
          activeCharacterId={character.id}
          onSelectCard={(char) => {
            setCharacter(char);
            showToast(`Equipped ${char.name} to player card workbench`);
          }}
          onRemoveFromDeck={handleRemoveFromDeck}
          onSaveDeckToGoogleDrive={handleSaveDeckToGoogleDrive}
          onExportDeckJson={handleExportDeckJson}
        />
      </main>

      {/* Character Vault Drawer Modal */}
      <CharacterVault
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        savedCharacters={deck}
        activeCharacterId={character.id}
        onSelectCharacter={(char) => setCharacter(char)}
        onDeleteCharacter={handleRemoveFromDeck}
        onClearVault={() => {
          setDeck([]);
          showToast('My Deck cleared');
        }}
        onNewCharacter={handleGenerateCharacter}
      />

      {/* Feedback Toast Notification */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border-2 border-amber-500/80 bg-[#161014] px-4 py-2.5 text-xs font-bold text-amber-200 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{ fontFamily: "'MedievalSharp', serif" }}
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-amber-950/60 bg-[#090709] py-8 text-center text-xs text-amber-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p style={{ fontFamily: "'MedievalSharp', serif" }}>
            RealmForge · Ancient Alchemist’s Workbench & Player Card Studio
          </p>
          <p className="text-slate-400">
            Export cards to Google Drive or download formatted Markdown and Text dossiers.
          </p>
        </div>
      </footer>
    </div>
  );
}
