import React from 'react';
import { Bookmark, Heart, Zap, Sword, Trash2, ArrowRight, Download, Cloud, Layers } from 'lucide-react';
import { Character } from '../types/character';
import { CLASS_METADATA } from '../data/characterData';
import { soundFX } from '../utils/soundEffects';

interface MyDeckListProps {
  deck: Character[];
  activeCharacterId: string;
  onSelectCard: (char: Character) => void;
  onRemoveFromDeck: (id: string) => void;
  onSaveDeckToGoogleDrive: () => void;
  onExportDeckJson: () => void;
}

export const MyDeckList: React.FC<MyDeckListProps> = ({
  deck,
  activeCharacterId,
  onSelectCard,
  onRemoveFromDeck,
  onSaveDeckToGoogleDrive,
  onExportDeckJson,
}) => {
  return (
    <section id="my-deck-section" className="w-full max-w-4xl mx-auto mt-10">
      <div className="rounded-2xl border-2 border-amber-900/60 bg-gradient-to-b from-[#181216]/95 via-[#120d11]/95 to-[#0b080a]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/40 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-950/70 border border-amber-600/50 text-amber-300">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2
                className="text-lg sm:text-xl font-bold text-amber-200"
                style={{ fontFamily: "'MedievalSharp', 'Cinzel Decorative', serif" }}
              >
                My Deck ({deck.length} {deck.length === 1 ? 'Card' : 'Cards'})
              </h2>
              <p className="text-xs text-slate-400">
                Your collection of saved player cards on the alchemist’s workbench
              </p>
            </div>
          </div>

          {/* Deck Action Buttons */}
          {deck.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onSaveDeckToGoogleDrive}
                className="flex items-center gap-1.5 rounded-lg border border-sky-700/60 bg-sky-950/40 px-3 py-1.5 text-xs font-semibold text-sky-200 hover:bg-sky-900/50 transition-colors"
                title="Save entire deck compendium to Google Drive"
              >
                <Cloud className="h-3.5 w-3.5 text-sky-400" />
                <span>Save Deck to Drive</span>
              </button>

              <button
                type="button"
                onClick={onExportDeckJson}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-amber-600 transition-colors"
                title="Export deck as JSON file"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>Export JSON</span>
              </button>
            </div>
          )}
        </div>

        {/* Deck Cards Carousel / Grid */}
        {deck.length === 0 ? (
          <div className="py-8 text-center rounded-xl border border-dashed border-amber-900/40 bg-black/30 p-6">
            <Bookmark className="h-8 w-8 text-amber-600/50 mx-auto mb-2" />
            <p
              className="text-sm font-semibold text-amber-300/80"
              style={{ fontFamily: "'MedievalSharp', serif" }}
            >
              Your Deck is Empty
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Click the <strong className="text-amber-300">&quot;Save to Deck&quot;</strong> button on any generated player card above to save your favorite heroes here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deck.map((char) => {
              const meta = CLASS_METADATA[char.class];
              const isActive = char.id === activeCharacterId;

              return (
                <div
                  key={char.id}
                  className={`relative rounded-xl border-2 p-3 transition-all duration-200 flex flex-col justify-between ${
                    isActive
                      ? 'border-amber-500 bg-amber-950/30 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                      : 'border-amber-900/40 bg-[#161217]/90 hover:border-amber-700/60'
                  }`}
                >
                  {/* Top: Thumbnail, Name, Class */}
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={char.portraitUrl}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 rounded-lg object-cover border border-amber-600/50 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3
                            className="text-sm font-bold text-amber-100 truncate"
                            style={{ fontFamily: "'MedievalSharp', serif" }}
                          >
                            {char.name}
                          </h3>
                          {isActive && (
                            <span className="text-[9px] uppercase tracking-wider font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600/40 shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          Lvl {char.level} · {char.race} ·{' '}
                          <span style={{ color: meta.accentColor }} className="font-semibold">
                            {char.class}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Stats Pill Row: Health (50-100), Mana (20-100), Strength (10-50) */}
                    <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center text-[10px] bg-black/50 rounded-lg p-1.5 border border-amber-950/70">
                      <div className="flex items-center justify-center gap-1 text-rose-300 font-bold">
                        <Heart className="h-3 w-3 fill-rose-500 text-rose-500 shrink-0" />
                        <span>{char.health ?? char.hp} HP</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sky-300 font-bold">
                        <Zap className="h-3 w-3 fill-sky-400 text-sky-400 shrink-0" />
                        <span>{char.mana} MP</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-amber-300 font-bold">
                        <Sword className="h-3 w-3 text-amber-400 shrink-0" />
                        <span>{char.strength ?? char.attributes.STR} STR</span>
                      </div>
                    </div>

                    {/* Backstory: 1-2 sentence origin story */}
                    <div className="mt-2 rounded-lg bg-black/40 p-2 border border-amber-950/40">
                      <p className="text-[10px] text-amber-100/90 italic line-clamp-2 leading-relaxed">
                        &ldquo;{char.backstory}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2 border-t border-amber-950/60 flex items-center justify-between gap-2">
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playClickSound();
                          onSelectCard(char);
                        }}
                        className="flex items-center gap-1 rounded-lg border border-amber-600/50 bg-amber-950/40 px-2.5 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-900/60 transition-colors"
                      >
                        <span>View Card</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-amber-400 italic">Currently on workbench</span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playClickSound();
                        onRemoveFromDeck(char.id);
                      }}
                      title="Remove from My Deck"
                      className="rounded-lg p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
