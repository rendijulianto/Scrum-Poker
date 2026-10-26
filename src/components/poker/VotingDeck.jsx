import React from 'react';
import { FIBONACCI_CARDS } from '../../constants/cards';
import { soundFx } from '../../utils/sound';

export function VotingDeck({ selectedVote, onSelectVote, disabled, isSpectator }) {
  if (isSpectator) {
    return (
      <div className="py-4 text-center">
        <span className="text-xs text-zinc-500 font-mono">
          Mode Penonton Aktif: Anda tidak memiliki kartu voting pada putaran ini.
        </span>
      </div>
    );
  }

  const handleCardClick = (card) => {
    soundFx.playCardSelect();
    onSelectVote(card);
  };

  return (
    <div className="w-full pt-4 pb-2">
      <div className="text-center mb-2.5">
        <span className="text-xs font-medium text-zinc-400">
          {disabled ? 'Estimasi telah dibuka' : 'Pilih Estimasi Story Point Anda:'}
        </span>
      </div>

      {/* Horizontal Cards Deck */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 px-2 scrollbar-none">
        {FIBONACCI_CARDS.map((card) => {
          const isSelected = selectedVote === card;

          return (
            <button
              key={card}
              type="button"
              disabled={disabled}
              onClick={() => handleCardClick(card)}
              className={`relative shrink-0 w-11 h-16 sm:w-13 sm:h-20 rounded-xl font-mono text-base sm:text-lg font-bold transition-all duration-150 flex items-center justify-center select-none active:scale-[0.95] ${
                disabled
                  ? 'opacity-40 cursor-not-allowed bg-zinc-900 border border-zinc-800 text-zinc-500'
                  : isSelected
                  ? 'bg-indigo-600 text-white border-2 border-indigo-400 -translate-y-2 shadow-lg shadow-indigo-600/30'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 hover:-translate-y-1'
              }`}
            >
              {card}
            </button>
          );
        })}
      </div>
    </div>
  );
}
