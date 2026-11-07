import React from 'react';
import { X, Trash2, ArrowRight, Download, Users, PlusCircle } from 'lucide-react';
import { Character } from '../types/character';
import { CLASS_METADATA } from '../data/characterData';
import { soundFX } from '../utils/soundEffects';
import { downloadCharacterFile } from '../utils/characterGenerator';

interface CharacterVaultProps {
  isOpen: boolean;
  onClose: () => void;
  savedCharacters: Character[];
  activeCharacterId: string;
  onSelectCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onClearVault: () => void;
  onNewCharacter: () => void;
}

export const CharacterVault: React.FC<CharacterVaultProps> = ({
  isOpen,
  onClose,
  savedCharacters,
  activeCharacterId,
  onSelectCharacter,
  onDeleteCharacter,
  onClearVault,
  onNewCharacter,
}) => {
  if (!isOpen) return null;

  const handleExportRoster = () => {
    soundFX.playClickSound();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedCharacters, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `realmforge_roster_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-amber-900/60 bg-[#10131d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#141824]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-300">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h2
                className="text-lg font-bold text-slate-100 font-serif"
                style={{ fontFamily: 'Cinzel, Georgia, serif' }}
              >
                Adventurer Roster & Vault
              </h2>
              <p className="text-xs text-slate-400">
                {savedCharacters.length} saved hero{savedCharacters.length === 1 ? '' : 'es'} in your persistent vault
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedCharacters.length > 0 && (
              <button
                type="button"
                onClick={handleExportRoster}
                title="Download Party JSON"
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300 hover:text-amber-200 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export JSON</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Character List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedCharacters.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-400 mb-4 font-serif">
                Your character vault is currently empty.
              </p>
              <button
                type="button"
                onClick={() => {
                  onNewCharacter();
                  onClose();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Forge Your First Hero</span>
              </button>
            </div>
          ) : (
            savedCharacters.map((char) => {
              const meta = CLASS_METADATA[char.class];
              const isActive = char.id === activeCharacterId;

              return (
                <div
                  key={char.id}
                  className={`flex items-center justify-between gap-4 rounded-xl p-3 border transition-all ${
                    isActive
                      ? 'border-amber-500/70 bg-amber-950/20 shadow-md'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={char.portraitUrl}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-lg object-cover shrink-0 border border-slate-700"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-100 truncate">
                          {char.name}
                        </h3>
                        {isActive && (
                          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                        <span>Lvl {char.level}</span>
                        <span aria-hidden="true">·</span>
                        <span>{char.race}</span>
                        <span aria-hidden="true">·</span>
                        <span style={{ color: meta.accentColor }} className="font-semibold">
                          {char.class}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playClickSound();
                        downloadCharacterFile(char, 'markdown');
                      }}
                      title="Download Markdown Sheet"
                      className="rounded-lg p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playClickSound();
                          onSelectCharacter(char);
                          onClose();
                        }}
                        className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:border-amber-600 hover:text-amber-200 transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playClickSound();
                        onDeleteCharacter(char.id);
                      }}
                      title="Delete from Vault"
                      className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {savedCharacters.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3 bg-[#141824] text-xs">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all heroes from your vault?')) {
                  onClearVault();
                }
              }}
              className="text-slate-500 hover:text-rose-400 transition-colors"
            >
              Clear Entire Vault
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-3 py-1.5 font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
