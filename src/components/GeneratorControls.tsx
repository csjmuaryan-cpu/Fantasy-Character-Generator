import React from 'react';
import { Dices, Sparkles, SlidersHorizontal, Shield, Flame, VenetianMask, Trees, Sun, Music, Skull } from 'lucide-react';
import { CharacterClass, CharacterRace } from '../types/character';
import { CLASS_METADATA } from '../data/characterData';

interface GeneratorControlsProps {
  onGenerate: () => void;
  isGenerating: boolean;
  selectedClass: CharacterClass | 'RANDOM';
  onSelectClass: (c: CharacterClass | 'RANDOM') => void;
  selectedRace: CharacterRace | 'RANDOM';
  onSelectRace: (r: CharacterRace | 'RANDOM') => void;
  level: number;
  onChangeLevel: (lvl: number) => void;
}

const CLASS_OPTIONS: { id: CharacterClass | 'RANDOM'; label: string; icon: React.ReactNode }[] = [
  { id: 'RANDOM', label: 'Random Class', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'Warrior', label: 'Warrior', icon: <Shield className="h-3.5 w-3.5 text-rose-400" /> },
  { id: 'Mage', label: 'Mage', icon: <Flame className="h-3.5 w-3.5 text-sky-400" /> },
  { id: 'Rogue', label: 'Rogue', icon: <VenetianMask className="h-3.5 w-3.5 text-emerald-400" /> },
  { id: 'Ranger', label: 'Ranger', icon: <Trees className="h-3.5 w-3.5 text-green-400" /> },
  { id: 'Cleric', label: 'Cleric', icon: <Sun className="h-3.5 w-3.5 text-amber-400" /> },
  { id: 'Bard', label: 'Bard', icon: <Music className="h-3.5 w-3.5 text-purple-400" /> },
  { id: 'Druid', label: 'Druid', icon: <Trees className="h-3.5 w-3.5 text-teal-400" /> },
  { id: 'Warlock', label: 'Warlock', icon: <Skull className="h-3.5 w-3.5 text-violet-400" /> },
];

const RACE_OPTIONS: (CharacterRace | 'RANDOM')[] = [
  'RANDOM',
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

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  onGenerate,
  isGenerating,
  selectedClass,
  onSelectClass,
  selectedRace,
  onSelectRace,
  level,
  onChangeLevel,
}) => {
  return (
    <section id="generator-cta" className="relative w-full rounded-2xl border border-amber-900/30 bg-gradient-to-b from-[#161a26]/90 via-[#10131d]/90 to-[#0c0e14]/90 p-5 sm:p-7 shadow-xl shadow-black/40 backdrop-blur-md">
      {/* Decorative filigree corners */}
      <div className="absolute top-2 left-2 text-amber-500/20 text-xs font-serif select-none pointer-events-none">◆</div>
      <div className="absolute top-2 right-2 text-amber-500/20 text-xs font-serif select-none pointer-events-none">◆</div>
      <div className="absolute bottom-2 left-2 text-amber-500/20 text-xs font-serif select-none pointer-events-none">◆</div>
      <div className="absolute bottom-2 right-2 text-amber-500/20 text-xs font-serif select-none pointer-events-none">◆</div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Main Call to Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl px-7 py-4 text-base font-bold text-amber-950 shadow-lg transition-all active:scale-[0.98] ${
              isGenerating
                ? 'bg-amber-400 cursor-wait'
                : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 hover:shadow-amber-500/20'
            }`}
            style={{ fontFamily: 'Cinzel, Georgia, serif' }}
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />

            <Dices
              className={`h-6 w-6 text-amber-950 transition-transform ${
                isGenerating ? 'animate-spin' : 'group-hover:rotate-45'
              }`}
            />
            <span className="tracking-wide">
              {isGenerating ? 'Forging Character...' : 'Forge Fantasy Character'}
            </span>
          </button>

          <div className="text-xs text-slate-400 flex flex-col justify-center">
            <span className="font-medium text-amber-300/90">Instant Generation</span>
            <span className="text-slate-500">Press <kbd className="rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">Space</kbd> or <kbd className="rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">G</kbd> anytime</span>
          </div>
        </div>

        {/* Right Side: Optional Archetype, Lineage, and Level Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0 border-t border-slate-800/80 lg:border-t-0">
          {/* Class Filter */}
          <div className="flex flex-col gap-1">
            <label htmlFor="class-select" className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Class Archetype
            </label>
            <div className="relative">
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => onSelectClass(e.target.value as CharacterClass | 'RANDOM')}
                className="h-9 appearance-none rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 pr-8 text-xs font-medium text-slate-200 hover:border-amber-700/60 focus:border-amber-500 focus:outline-none transition-colors cursor-pointer"
              >
                {CLASS_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Lineage Filter */}
          <div className="flex flex-col gap-1">
            <label htmlFor="race-select" className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Lineage / Race
            </label>
            <div className="relative">
              <select
                id="race-select"
                value={selectedRace}
                onChange={(e) => onSelectRace(e.target.value as CharacterRace | 'RANDOM')}
                className="h-9 appearance-none rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 pr-8 text-xs font-medium text-slate-200 hover:border-amber-700/60 focus:border-amber-500 focus:outline-none transition-colors cursor-pointer"
              >
                {RACE_OPTIONS.map((race) => (
                  <option key={race} value={race}>
                    {race === 'RANDOM' ? 'Random Lineage' : race}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Level Selector */}
          <div className="flex flex-col gap-1">
            <label htmlFor="level-select" className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Level: <span className="text-amber-300 font-bold tabular-nums">Lvl {level}</span>
            </label>
            <div className="flex items-center h-9 rounded-lg border border-slate-700/80 bg-slate-900/90 px-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeLevel(Math.max(1, level - 1))}
                disabled={level <= 1}
                className="flex h-5 w-5 items-center justify-center rounded text-xs text-slate-400 hover:text-amber-300 disabled:opacity-30 disabled:hover:text-slate-400"
              >
                -
              </button>
              <input
                id="level-select"
                type="range"
                min="1"
                max="20"
                value={level}
                onChange={(e) => onChangeLevel(Number(e.target.value))}
                className="h-1.5 w-16 sm:w-20 accent-amber-500 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => onChangeLevel(Math.min(20, level + 1))}
                disabled={level >= 20}
                className="flex h-5 w-5 items-center justify-center rounded text-xs text-slate-400 hover:text-amber-300 disabled:opacity-30 disabled:hover:text-slate-400"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
