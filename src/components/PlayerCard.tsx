import React, { useState } from 'react';
import {
  Heart,
  Zap,
  Sword,
  Sparkles,
  RefreshCw,
  Bookmark,
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  ChevronDown,
  Cloud,
  Edit3,
  Dices,
  Shield,
  Clock,
  Compass,
  Scroll,
} from 'lucide-react';
import { Character, CharacterClass, ItemRarity } from '../types/character';
import { CLASS_METADATA, CARTOON_PORTRAITS, PAINTERLY_PORTRAITS } from '../data/characterData';
import { formatModifier, downloadCharacterFile, formatCharacterMarkdown } from '../utils/characterGenerator';
import { soundFX } from '../utils/soundEffects';

interface PlayerCardProps {
  character: Character;
  onGenerateCartoonPortrait: () => void;
  onRegenerateCartoonPortrait: () => void;
  onGenerateBackstory: () => void;
  onSaveToDeck: (char: Character) => void;
  isSavedInDeck: boolean;
  onRerollStats: () => void;
  onRerollName: () => void;
  onUpdateCharacterName: (name: string) => void;
  onToast: (msg: string) => void;
  onSaveToGoogleDrive: (char: Character) => void;
}

const RARITY_COLORS: Record<ItemRarity, { text: string; border: string; bg: string }> = {
  Common: { text: 'text-slate-300', border: 'border-slate-600', bg: 'bg-slate-800/40' },
  Uncommon: { text: 'text-emerald-300', border: 'border-emerald-600/50', bg: 'bg-emerald-950/20' },
  Rare: { text: 'text-sky-300', border: 'border-sky-600/50', bg: 'bg-sky-950/20' },
  Epic: { text: 'text-purple-300', border: 'border-purple-600/50', bg: 'bg-purple-950/20' },
  Legendary: { text: 'text-amber-300', border: 'border-amber-500/60', bg: 'bg-amber-950/30' },
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  character,
  onGenerateCartoonPortrait,
  onRegenerateCartoonPortrait,
  onGenerateBackstory,
  onSaveToDeck,
  isSavedInDeck,
  onRerollStats,
  onRerollName,
  onUpdateCharacterName,
  onToast,
  onSaveToGoogleDrive,
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
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Outer Card Glow and Gilded Beveled Border */}
      <div
        className="relative rounded-3xl p-2 sm:p-3 shadow-2xl transition-all duration-300"
        style={{
          background: 'linear-gradient(145deg, #78350f 0%, #29180b 25%, #451a03 50%, #1c0e07 75%, #92400e 100%)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(217, 119, 6, 0.3)',
        }}
      >
        {/* Inner Card Frame */}
        <article
          id="bordered-player-card"
          className="relative rounded-2xl border-2 border-amber-600/70 bg-gradient-to-b from-[#1c1514] via-[#120e11] to-[#0d090b] p-4 sm:p-6 md:p-8 text-slate-100 overflow-hidden"
        >
          {/* Subtle Alchemical Transmutation Background Watermark SVG */}
          <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-[120%] h-[120%] text-amber-500 animate-spin" style={{ animationDuration: '120s' }}>
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="100,10 178,145 22,145" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="100,190 22,55 178,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Ornate Corner Runes */}
          <div className="absolute top-2 left-2 text-amber-500/40 text-sm font-serif select-none pointer-events-none">ᚱ</div>
          <div className="absolute top-2 right-2 text-amber-500/40 text-sm font-serif select-none pointer-events-none">ᚦ</div>
          <div className="absolute bottom-2 left-2 text-amber-500/40 text-sm font-serif select-none pointer-events-none">ᚲ</div>
          <div className="absolute bottom-2 right-2 text-amber-500/40 text-sm font-serif select-none pointer-events-none">ᛞ</div>

          {/* Card Top Header Banner */}
          <header className="relative border-b-2 border-amber-700/60 pb-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                {/* Character Name in Stylized Fantasy Font */}
                {isEditingName ? (
                  <form onSubmit={handleNameSubmit} className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      autoFocus
                      className="rounded-lg border-2 border-amber-500 bg-black/80 px-3 py-1 text-2xl font-bold text-amber-200 focus:outline-none"
                      style={{ fontFamily: "'MedievalSharp', 'Cinzel', serif" }}
                    />
                    <button
                      type="submit"
                      className="rounded bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-amber-400"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="rounded bg-slate-800 px-3 py-1 text-xs text-slate-300"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h1
                      className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 drop-shadow-md"
                      style={{ fontFamily: "'MedievalSharp', 'Cinzel Decorative', cursive, serif" }}
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

                {/* Subtitle / Epithet */}
                <p
                  className="text-sm sm:text-base font-serif italic text-amber-400/90 mt-0.5"
                  style={{ fontFamily: "'MedievalSharp', 'Cinzel', serif" }}
                >
                  {character.title}
                </p>

                {/* Class & Race Lineage Badges */}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300 font-medium">
                  <span className="font-bold text-amber-300">{character.race}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-200">{character.subclass}</span>
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
              </div>

              {/* Card Level Badge */}
              <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
                <div className="flex items-center gap-2 rounded-xl border border-amber-600/60 bg-amber-950/40 px-3.5 py-1.5 shadow-inner">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold">Player Card</span>
                    <span
                      className="text-base font-black text-amber-200"
                      style={{ fontFamily: "'MedievalSharp', serif" }}
                    >
                      Level {character.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Central Grid: Portrait on Left, Stats & Lore on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 cols): Portrait Display & Cartoon Generate/Regenerate Controls */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Portrait Box with Gilded Frame */}
              <div className="relative w-full aspect-square max-w-[320px] rounded-2xl p-1.5 bg-gradient-to-b from-amber-500 via-amber-700 to-amber-950 shadow-xl overflow-hidden group">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950">
                  {!imageError ? (
                    <img
                      src={character.portraitUrl}
                      alt={`${character.name} the ${character.class}`}
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-900">
                      <Sparkles className="h-10 w-10 text-amber-400 mb-2" />
                      <span className="text-xs font-serif font-bold text-slate-200">{character.class}</span>
                    </div>
                  )}

                  {/* Cartoon / Video Game Style Watermark Tag */}
                  <div className="absolute top-2 left-2 rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 border border-amber-500/40 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    Cartoon / Game Art
                  </div>
                </div>
              </div>

              {/* Portrait Buttons: "Generate" and "Regenerate" */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClickSound();
                    onGenerateCartoonPortrait();
                  }}
                  className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/60 bg-gradient-to-r from-amber-600/80 to-amber-700/80 px-3 py-2 text-xs font-bold text-slate-950 hover:from-amber-500 hover:to-amber-600 shadow-md transition-all active:scale-95"
                  style={{ fontFamily: "'MedievalSharp', serif" }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate Portrait</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClickSound();
                    onRegenerateCartoonPortrait();
                  }}
                  title="Cycle to next cartoon portrait variant"
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs font-bold text-amber-200 hover:border-amber-600 hover:bg-slate-800 transition-all active:scale-95"
                  style={{ fontFamily: "'MedievalSharp', serif" }}
                >
                  <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Right Column (7 cols): Randomly Generated Health, Mana, Strength Stats & Backstory Box */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              {/* PRIMARY CARD STATS: Health, Mana, and Strength (MANDATORY REQUIREMENT) */}
              <div className="rounded-2xl border-2 border-amber-600/50 bg-[#161217]/90 p-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-2 mb-3">
                  <span
                    className="text-xs uppercase tracking-widest text-amber-300 font-bold"
                    style={{ fontFamily: "'MedievalSharp', serif" }}
                  >
                    Core Player Stats
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClickSound();
                      onRerollStats();
                    }}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Reroll Stats</span>
                  </button>
                </div>

                {/* 3 Prominent Stat Gems for Health, Mana, and Strength */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  {/* Health Stat */}
                  <div className="rounded-xl border-2 border-rose-600/70 bg-gradient-to-b from-rose-950/70 to-rose-950/40 p-3 shadow-inner flex flex-col items-center justify-between">
                    <div className="flex items-center gap-1.5 text-rose-300 text-[11px] font-bold uppercase tracking-wider">
                      <Heart className="h-4 w-4 fill-rose-500 text-rose-500 shrink-0" />
                      <span>Health</span>
                    </div>
                    <span
                      className="text-3xl sm:text-4xl font-black text-rose-100 tabular-nums my-1"
                      style={{ fontFamily: "'MedievalSharp', serif" }}
                    >
                      {character.health ?? character.hp}
                    </span>
                    <span className="text-[10px] font-semibold text-rose-300/80 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/40">
                      50–100 Range
                    </span>
                  </div>

                  {/* Mana Stat */}
                  <div className="rounded-xl border-2 border-sky-600/70 bg-gradient-to-b from-sky-950/70 to-sky-950/40 p-3 shadow-inner flex flex-col items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sky-300 text-[11px] font-bold uppercase tracking-wider">
                      <Zap className="h-4 w-4 fill-sky-400 text-sky-400 shrink-0" />
                      <span>Mana</span>
                    </div>
                    <span
                      className="text-3xl sm:text-4xl font-black text-sky-100 tabular-nums my-1"
                      style={{ fontFamily: "'MedievalSharp', serif" }}
                    >
                      {character.mana}
                    </span>
                    <span className="text-[10px] font-semibold text-sky-300/80 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                      20–100 Range
                    </span>
                  </div>

                  {/* Strength Stat */}
                  <div className="rounded-xl border-2 border-amber-600/70 bg-gradient-to-b from-amber-950/70 to-amber-950/40 p-3 shadow-inner flex flex-col items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                      <Sword className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>Strength</span>
                    </div>
                    <span
                      className="text-3xl sm:text-4xl font-black text-amber-100 tabular-nums my-1"
                      style={{ fontFamily: "'MedievalSharp', serif" }}
                    >
                      {character.strength ?? character.attributes.STR}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-300/80 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                      10–50 Range
                    </span>
                  </div>
                </div>

                {/* Secondary Ability Scores Mini-Row */}
                <div className="mt-3 pt-2.5 border-t border-amber-950/50 grid grid-cols-5 gap-1.5 text-center text-xs">
                  <div className="rounded bg-black/40 p-1">
                    <span className="text-[9px] text-slate-400 block font-bold">DEX</span>
                    <span className="font-bold text-slate-200">{character.attributes.DEX}</span>
                  </div>
                  <div className="rounded bg-black/40 p-1">
                    <span className="text-[9px] text-slate-400 block font-bold">CON</span>
                    <span className="font-bold text-slate-200">{character.attributes.CON}</span>
                  </div>
                  <div className="rounded bg-black/40 p-1">
                    <span className="text-[9px] text-slate-400 block font-bold">INT</span>
                    <span className="font-bold text-slate-200">{character.attributes.INT}</span>
                  </div>
                  <div className="rounded bg-black/40 p-1">
                    <span className="text-[9px] text-slate-400 block font-bold">WIS</span>
                    <span className="font-bold text-slate-200">{character.attributes.WIS}</span>
                  </div>
                  <div className="rounded bg-black/40 p-1">
                    <span className="text-[9px] text-slate-400 block font-bold">CHA</span>
                    <span className="font-bold text-slate-200">{character.attributes.CHA}</span>
                  </div>
                </div>
              </div>

              {/* ORIGIN BACKSTORY SECTION (MANDATORY REQUIREMENT) */}
              <div className="rounded-2xl border border-amber-700/50 bg-[#151014]/90 p-4 shadow-lg flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-amber-900/40">
                  <div className="flex items-center gap-2">
                    <Scroll className="h-4 w-4 text-amber-400" />
                    <span
                      className="text-xs uppercase tracking-widest text-amber-300 font-bold"
                      style={{ fontFamily: "'MedievalSharp', serif" }}
                    >
                      Origin Backstory
                    </span>
                  </div>

                  {/* "Generate Backstory" Button */}
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClickSound();
                      onGenerateBackstory();
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-amber-500/70 bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-200 hover:bg-amber-900/50 hover:text-amber-100 transition-colors shadow-sm"
                    style={{ fontFamily: "'MedievalSharp', serif" }}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Generate Backstory</span>
                  </button>
                </div>

                {/* 1-to-2 Sentence Origin Story */}
                <div className="mt-3 p-3 rounded-xl bg-black/50 border border-amber-950/40">
                  <p
                    className="text-sm text-amber-100/90 leading-relaxed italic"
                    style={{ fontFamily: "'MedievalSharp', 'Cinzel', serif" }}
                  >
                    &ldquo;{character.backstory}&rdquo;
                  </p>
                </div>

                {/* Current Quest note */}
                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="text-amber-400 font-semibold">Active Quest:</span>
                  <span className="truncate">{character.questOrGoal}</span>
                </div>
              </div>

              {/* Equipment & Signature Relic Mini-Box */}
              <div className="rounded-xl border border-slate-800 bg-[#120e11]/80 p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Sword className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-400">Armament:</span>
                  <span className="font-bold text-slate-200 truncate">{character.equipment.weapon}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-amber-400 text-[10px] font-bold uppercase">Relic:</span>
                  <span className="font-semibold text-slate-300 truncate max-w-[160px]">
                    {character.equipment.signatureRelic.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD ACTION BAR: "Save to Deck", Google Drive, Download, Copy */}
          <footer className="mt-6 pt-5 border-t-2 border-amber-800/50 flex flex-wrap items-center justify-between gap-3">
            {/* Left Actions: "Save to Deck" */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFX.playSaveSound();
                  onSaveToDeck(character);
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-md transition-all active:scale-95 ${
                  isSavedInDeck
                    ? 'border border-amber-500 bg-amber-500 text-slate-950'
                    : 'border border-amber-600/70 bg-gradient-to-r from-amber-700/60 to-amber-900/60 text-amber-200 hover:from-amber-600 hover:to-amber-800 hover:text-white'
                }`}
                style={{ fontFamily: "'MedievalSharp', serif" }}
              >
                <Bookmark className={`h-4 w-4 ${isSavedInDeck ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
                <span>{isSavedInDeck ? 'Saved in My Deck' : 'Save to Deck'}</span>
              </button>

              {/* Save to Google Drive */}
              <button
                type="button"
                onClick={() => {
                  soundFX.playClickSound();
                  onSaveToGoogleDrive(character);
                }}
                title="Save Character Dossier to Google Drive"
                className="flex items-center gap-1.5 rounded-xl border border-sky-700/60 bg-sky-950/40 px-3.5 py-2.5 text-xs font-semibold text-sky-200 hover:bg-sky-900/50 hover:text-white transition-colors"
              >
                <Cloud className="h-4 w-4 text-sky-400" />
                <span>Save to Google Drive</span>
              </button>
            </div>

            {/* Right Actions: Download Dropdown & Copy */}
            <div className="flex items-center gap-2">
              {/* Download Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDownloadMenu((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 hover:border-amber-600 hover:text-amber-200 transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-amber-400" />
                  <span>Download</span>
                  <ChevronDown className={`h-3 w-3 opacity-70 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
                </button>

                {showDownloadMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowDownloadMenu(false)} />
                    <div className="absolute right-0 bottom-full mb-1.5 w-52 rounded-xl border border-slate-700 bg-[#161a26] p-1.5 shadow-2xl z-40 text-left">
                      <button
                        type="button"
                        onClick={() => handleDownload('markdown')}
                        className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-left text-slate-200 hover:bg-amber-950/50 hover:text-amber-200 transition-colors"
                      >
                        <FileCode className="h-4 w-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-100">Markdown (.md)</div>
                          <div className="text-[10px] text-slate-400">Headings & stat tables</div>
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
                          <div className="text-[10px] text-slate-400">Formatted ASCII card</div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Copy Markdown */}
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 hover:border-amber-600 hover:text-amber-200 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};
