import React from 'react';
import { Volume2, VolumeX, Bookmark, Sparkles, Download } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface TopBarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  vaultCount: number;
  onOpenVault: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isMuted,
  onToggleMute,
  vaultCount,
  onOpenVault,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-950/40 bg-[#0c0e14]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand wordmark in Cinzel face */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 text-amber-100 shadow-md shadow-amber-950/50">
            <Sparkles className="h-5 w-5" />
          </div>
          <a
            href="/"
            className="text-xl font-bold tracking-wider text-amber-200 transition-colors hover:text-amber-100 whitespace-nowrap shrink-0 font-serif"
            style={{ fontFamily: 'Cinzel, Georgia, serif' }}
          >
            RealmForge
          </a>
        </div>

        {/* Zone 2: 4 clean single-line nav anchors */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest text-slate-400 font-medium">
          <a href="#generator-cta" className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
            Generator
          </a>
          <a href="#character-sheet" className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
            Character Sheet
          </a>
          <a href="#attributes-section" className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
            Attributes & Combat
          </a>
          <a href="#equipment-section" className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
            Equipment & Relics
          </a>
        </nav>

        {/* Zone 3: 1 primary action or clean utility buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-amber-300 hover:border-amber-900/50 transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <a
            href="/realmforge_source_code.zip"
            download="realmforge_source_code.zip"
            title="Download Application Source Code as ZIP"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-600 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Source Code (.ZIP)</span>
            <span className="sm:hidden">.ZIP</span>
          </a>

          <button
            type="button"
            onClick={() => {
              soundFX.playClickSound();
              onOpenVault();
            }}
            className="flex items-center gap-2 rounded-lg border border-amber-900/60 bg-amber-950/30 px-3.5 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-900/40 hover:text-amber-100 transition-colors whitespace-nowrap shrink-0"
          >
            <Bookmark className="h-3.5 w-3.5 text-amber-400" />
            <span>Character Vault</span>
            {vaultCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-slate-950">
                {vaultCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
