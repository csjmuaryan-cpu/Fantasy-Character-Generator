import React, { useState } from 'react';
import {
  Shield,
  Heart,
  Zap,
  Clock,
  Compass,
  Sword,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Bookmark,
  Scroll,
  Feather,
  Edit3,
  Flame,
  Award,
  Download,
  FileText,
  FileCode,
  ChevronDown,
} from 'lucide-react';
import { Character, AttributeName, ItemRarity } from '../types/character';
import { CLASS_METADATA } from '../data/characterData';
import { formatModifier, downloadCharacterFile, formatCharacterMarkdown } from '../utils/characterGenerator';
import { soundFX } from '../utils/soundEffects';

interface CharacterCardProps {
  character: Character;
  onRerollName: () => void;
  onRerollStats: () => void;
  onRerollGear: () => void;
  onRerollLore: () => void;
  onSaveToVault: (char: Character) => void;
  isSavedInVault: boolean;
  onUpdateCharacterName: (newName: string) => void;
  onToast: (msg: string) => void;
}

const RARITY_COLORS: Record<ItemRarity, { text: string; border: string; bg: string }> = {
  Common: { text: 'text-slate-300', border: 'border-slate-600', bg: 'bg-slate-800/40' },
  Uncommon: { text: 'text-emerald-300', border: 'border-emerald-600/50', bg: 'bg-emerald-950/20' },
  Rare: { text: 'text-sky-300', border: 'border-sky-600/50', bg: 'bg-sky-950/20' },
  Epic: { text: 'text-purple-300', border: 'border-purple-600/50', bg: 'bg-purple-950/20' },
  Legendary: { text: 'text-amber-300', border: 'border-amber-500/60', bg: 'bg-amber-950/30' },
};

const STAT_DESCRIPTIONS: Record<AttributeName, string> = {
  STR: 'Melee power, athletic feats, and physical force',
  DEX: 'Agility, reflexes, stealth, and ranged accuracy',
  CON: 'Vitality, stamina, resilience, and pain tolerance',
  INT: 'Arcane acumen, deductive logic, and memory',
  WIS: 'Perception, primal intuition, and willpower',
  CHA: 'Force of personality, eloquence, and presence',
};

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onRerollName,
  onRerollStats,
  onRerollGear,
  onRerollLore,
  onSaveToVault,
  isSavedInVault,
  onUpdateCharacterName,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(character.name);
  const [imageError, setImageError] = useState(false);

  const meta = CLASS_METADATA[character.class];

  const handleCopyMarkdown = () => {
    soundFX.playClickSound();
    const md = formatCharacterMarkdown(character);

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      onToast('Character sheet copied as Markdown');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = (format: 'markdown' | 'text') => {
    soundFX.playClickSound();
    const filename = downloadCharacterFile(character, format);
    setShowDownloadMenu(false);
    onToast(`Downloaded ${filename}`);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedName.trim()) {
      onUpdateCharacterName(editedName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <article
      id="character-sheet"
      className="relative w-full rounded-2xl border border-amber-900/40 bg-gradient-to-b from-[#181d29] via-[#121622] to-[#0d1017] p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/60"
    >
      {/* Ornate corner heraldry accents */}
      <div className="absolute top-3 left-3 text-amber-500/30 text-sm font-serif select-none pointer-events-none">❖</div>
      <div className="absolute top-3 right-3 text-amber-500/30 text-sm font-serif select-none pointer-events-none">❖</div>
      <div className="absolute bottom-3 left-3 text-amber-500/30 text-sm font-serif select-none pointer-events-none">❖</div>
      <div className="absolute bottom-3 right-3 text-amber-500/30 text-sm font-serif select-none pointer-events-none">❖</div>

      {/* Top Section: Hero Avatar & Title Lockup */}
      <div className="flex flex-col lg:flex-row items-start gap-6 pb-8 border-b border-slate-800">
        {/* Character Portrait */}
        <div className="relative shrink-0 mx-auto lg:mx-0">
          <div
            className="h-36 w-36 sm:h-44 sm:w-44 rounded-2xl p-1 shadow-xl overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, ${meta.accentColor} 0%, #1e293b 100%)`,
            }}
          >
            {!imageError ? (
              <img
                src={character.portraitUrl}
                alt={`${character.name} the ${character.class}`}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="h-full w-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="h-full w-full rounded-xl bg-slate-900 flex flex-col items-center justify-center p-3 text-center">
                <Sparkles className="h-10 w-10 text-amber-400 mb-2" />
                <span className="text-xs font-serif font-bold text-slate-200">{character.class}</span>
              </div>
            )}
          </div>
          {/* Level and Hit Die indicator */}
          <div className="absolute -bottom-2 -right-2 rounded-lg border border-amber-500/40 bg-slate-950/90 px-2.5 py-1 text-[11px] font-bold text-amber-300 shadow-md">
            Lvl {character.level} · d{meta.hitDie}
          </div>
        </div>

        {/* Character Identity & Titles */}
        <div className="flex-1 w-full text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              {/* Name with inline editing */}
              {isEditingName ? (
                <form onSubmit={handleNameSubmit} className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    autoFocus
                    className="rounded-lg border border-amber-600 bg-slate-900 px-3 py-1 text-xl sm:text-2xl font-bold text-amber-100 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded bg-amber-600 px-2.5 py-1 text-xs font-semibold text-slate-950 hover:bg-amber-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center lg:justify-start gap-2.5 group">
                  <h1
                    className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100"
                    style={{ fontFamily: 'Cinzel, Georgia, serif' }}
                  >
                    {character.name}
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedName(character.name);
                      setIsEditingName(true);
                    }}
                    title="Rename Character"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-amber-300"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClickSound();
                      onRerollName();
                    }}
                    title="Reroll Name Only"
                    className="p-1 text-slate-400 hover:text-amber-300 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Title Epithet */}
              <p
                className="text-sm sm:text-base font-serif italic text-amber-300/80 mt-0.5"
                style={{ fontFamily: 'Cinzel, Georgia, serif' }}
              >
                {character.title}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 mt-2 lg:mt-0">
              {/* Download Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDownloadMenu((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-700/60 bg-amber-950/30 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-900/40 hover:text-amber-100 transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-amber-400" />
                  <span>Download</span>
                  <ChevronDown className={`h-3 w-3 opacity-70 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
                </button>

                {showDownloadMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowDownloadMenu(false)}
                    />
                    <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-slate-700 bg-[#161a26] p-1.5 shadow-2xl z-40 text-left">
                      <button
                        type="button"
                        onClick={() => handleDownload('markdown')}
                        className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-left text-slate-200 hover:bg-amber-950/50 hover:text-amber-200 transition-colors"
                      >
                        <FileCode className="h-4 w-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-100">Markdown (.md)</div>
                          <div className="text-[10px] text-slate-400">Headings, tables, and notes</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload('text')}
                        className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-left text-slate-200 hover:bg-amber-950/50 hover:text-amber-200 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-100">Plain Text (.txt)</div>
                          <div className="text-[10px] text-slate-400">Formatted ASCII dossier</div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-amber-700 hover:text-amber-200 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Sheet'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSaveSound();
                  onSaveToVault(character);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSavedInVault
                    ? 'border border-amber-600/70 bg-amber-950/40 text-amber-300'
                    : 'border border-slate-700 bg-slate-800/80 text-slate-200 hover:border-amber-700 hover:text-amber-200'
                }`}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isSavedInVault ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isSavedInVault ? 'In Vault' : 'Save to Vault'}</span>
              </button>
            </div>
          </div>

          {/* Clean Unboxed Metadata (Zero-Pill Discipline with Typographic Separators) */}
          <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-slate-300">
            <span className="font-semibold text-amber-200">{character.race}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-semibold text-slate-100">{character.subclass}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span
              className="font-bold uppercase tracking-wider"
              style={{ color: meta.accentColor }}
            >
              {character.class}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">{character.alignment}</span>
          </div>

          {/* Class Description excerpt */}
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {meta.description}
          </p>
        </div>
      </div>

      {/* Vital Combat Metrics Strip */}
      <section className="py-6 border-b border-slate-800/80">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Health Points */}
          <div className="rounded-xl border border-rose-950/40 bg-gradient-to-br from-rose-950/30 to-slate-900/60 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-rose-300">
              <span className="font-medium uppercase tracking-wider text-[10px]">Health (HP)</span>
              <Heart className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums text-slate-100">{character.hp}</span>
              <span className="text-xs text-slate-500 font-medium">/{character.maxHp}</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Mana / Stamina */}
          <div className="rounded-xl border border-sky-950/40 bg-gradient-to-br from-sky-950/30 to-slate-900/60 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-sky-300">
              <span className="font-medium uppercase tracking-wider text-[10px]">Mana / Power</span>
              <Zap className="h-3.5 w-3.5 text-sky-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums text-slate-100">{character.mana}</span>
              <span className="text-xs text-slate-500 font-medium">pts</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Armor Class */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium uppercase tracking-wider text-[10px]">Armor Class (AC)</span>
              <Shield className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums text-slate-100">{character.armorClass}</span>
              <span className="text-[11px] text-slate-500">Defense</span>
            </div>
            <span className="text-[10px] text-slate-400 truncate mt-2">{character.equipment.armor}</span>
          </div>

          {/* Initiative */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium uppercase tracking-wider text-[10px]">Initiative</span>
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums text-slate-100">
                {formatModifier(character.initiative)}
              </span>
              <span className="text-[11px] text-slate-500">Reaction</span>
            </div>
            <span className="text-[10px] text-slate-400 truncate mt-2">DEX Based Turn Speed</span>
          </div>

          {/* Walking Speed */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium uppercase tracking-wider text-[10px]">Speed</span>
              <Compass className="h-3.5 w-3.5 text-teal-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums text-slate-100">{character.speed}</span>
              <span className="text-[11px] text-slate-500">ft / round</span>
            </div>
            <span className="text-[10px] text-slate-400 truncate mt-2">Base Racial Movement</span>
          </div>
        </div>
      </section>

      {/* Core RPG Attributes (STR, DEX, CON, INT, WIS, CHA) */}
      <section id="attributes-section" className="py-6 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Ability Scores & Modifiers
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFX.playClickSound();
              onRerollStats();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reroll Stats</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as AttributeName[]).map((attr) => {
            const score = character.attributes[attr];
            const mod = character.modifiers[attr];
            const isPrimary = meta.primaryAttr === attr;
            const isSecondary = meta.secondaryAttr === attr;
            // Visual fill percentage (score from 6 to 20 -> 0% to 100%)
            const fillPct = Math.min(100, Math.max(10, ((score - 6) / 14) * 100));

            return (
              <div
                key={attr}
                title={STAT_DESCRIPTIONS[attr]}
                className={`relative rounded-xl p-3 border transition-all ${
                  isPrimary
                    ? 'border-amber-600/60 bg-amber-950/20 shadow-md shadow-amber-950/30'
                    : isSecondary
                    ? 'border-slate-700 bg-slate-900/80'
                    : 'border-slate-800/80 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{attr}</span>
                  {isPrimary && (
                    <span className="text-[10px] font-semibold text-amber-400">Primary</span>
                  )}
                  {isSecondary && (
                    <span className="text-[10px] text-slate-400">Sec</span>
                  )}
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-100 tabular-nums">{score}</span>
                  <span
                    className={`text-sm font-bold tabular-nums px-1.5 py-0.5 rounded ${
                      mod >= 0 ? 'text-amber-300 bg-amber-950/40' : 'text-rose-400 bg-rose-950/30'
                    }`}
                  >
                    {formatModifier(mod)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isPrimary ? 'bg-amber-400' : 'bg-slate-500'
                    }`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>

                <p className="mt-2 text-[10px] text-slate-400 line-clamp-1">
                  {STAT_DESCRIPTIONS[attr]}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Equipment & Signature Relic Section */}
      <section id="equipment-section" className="py-6 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sword className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Armaments & Relics
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFX.playClickSound();
              onRerollGear();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reroll Gear</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Gear Column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sword className="h-4 w-4 text-slate-400" />
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Primary Weapon</span>
                </div>
                <span className="text-sm font-bold text-slate-100">{character.equipment.weapon}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Armor & Protection</span>
                </div>
                <span className="text-sm font-bold text-slate-100">{character.equipment.armor}</span>
              </div>

              <div className="pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Scroll className="h-4 w-4 text-slate-400" />
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Adventuring Kit</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  {character.equipment.gear.map((item, idx) => (
                    <span key={idx} className="rounded-md border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Signature Relic Card */}
          {(() => {
            const relic = character.equipment.signatureRelic;
            const rarityStyle = RARITY_COLORS[relic.rarity];
            return (
              <div className={`rounded-xl border ${rarityStyle.border} ${rarityStyle.bg} p-4 flex flex-col justify-between shadow-lg`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Signature Relic</span>
                    <span className={`text-xs font-bold ${rarityStyle.text}`}>
                      {relic.rarity}
                    </span>
                  </div>

                  <h3
                    className="mt-2 text-base font-bold text-slate-100 font-serif"
                    style={{ fontFamily: 'Cinzel, Georgia, serif' }}
                  >
                    {relic.name}
                  </h3>

                  <p className="mt-2 text-xs italic text-slate-400 leading-relaxed font-serif">
                    &ldquo;{relic.lore}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold uppercase text-amber-300/90 block mb-1">
                    Relic Resonance:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {relic.effect}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Background & Narrative Lore */}
      <section className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Feather className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Biography & Narrative Lore
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFX.playClickSound();
              onRerollLore();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reroll Lore</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Origin */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80 block mb-1.5">
              Origin & Lineage Heritage
            </span>
            <p className="text-slate-300 leading-relaxed text-sm">
              {character.background}
            </p>
          </div>

          {/* Current Quest */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80 block mb-1.5">
              Current Calling & Quest
            </span>
            <p className="text-slate-300 leading-relaxed text-sm">
              {character.questOrGoal}
            </p>
          </div>

          {/* Personality */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Defining Personality Trait
            </span>
            <p className="text-slate-300 leading-relaxed">
              {character.personalityTrait}
            </p>
          </div>

          {/* Flaw or Quirk */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Fatal Flaw or Notable Quirk
            </span>
            <p className="text-slate-300 leading-relaxed">
              {character.flawOrQuirk}
            </p>
          </div>
        </div>
      </section>
    </article>
  );
};
