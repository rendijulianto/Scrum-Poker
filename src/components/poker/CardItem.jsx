import React from 'react';
import { Cards, Check, Eye, User } from '@phosphor-icons/react';

export function CardItem({ participant, isRevealed }) {
  const isSpectator = participant.role === 'SPECTATOR';
  const hasVoted = participant.vote !== null && participant.vote !== undefined;

  return (
    <div className="flex flex-col items-center group">
      {/* Team Member Avatar Photo */}
      <div className="relative mb-2">
        <div
          className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden transition-all duration-300 ${
            hasVoted
              ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-950 scale-105'
              : 'border border-zinc-700/80 opacity-85'
          }`}
        >
          {participant.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold text-sm">
              {participant.name ? participant.name.charAt(0).toUpperCase() : <User size={18} />}
            </div>
          )}
        </div>

        {/* Micro Status Badge on Avatar */}
        {isSpectator ? (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-zinc-800 border border-zinc-950 flex items-center justify-center text-zinc-400">
            <Eye size={10} />
          </div>
        ) : hasVoted ? (
          <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-indigo-600 border border-zinc-950 flex items-center justify-center text-white shadow-sm">
            <Check size={11} weight="bold" />
          </div>
        ) : null}
      </div>

      {/* 3D Card Area */}
      <div className="w-16 h-22 sm:w-18 sm:h-26 perspective-1000 mb-2">
        {isSpectator ? (
          // Spectator Card Representation
          <div className="w-full h-full rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 flex flex-col items-center justify-center text-zinc-500">
            <Eye size={18} className="mb-1 text-zinc-600" />
            <span className="text-[10px] uppercase font-mono">Nonton</span>
          </div>
        ) : (
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
              isRevealed && hasVoted ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of Card (Tertutup / Backface sebelum Reveal) */}
            <div
              className={`absolute inset-0 w-full h-full rounded-xl backface-hidden flex flex-col items-center justify-center transition-all ${
                hasVoted
                  ? 'bg-zinc-900 border-2 border-indigo-500/60 shadow-lg shadow-indigo-950/20 text-indigo-400'
                  : 'bg-zinc-950/60 border border-dashed border-zinc-800 text-zinc-600'
              }`}
            >
              {hasVoted ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mb-1">
                    <Check size={14} className="text-indigo-400" weight="bold" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-medium">
                    Siap
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Cards size={18} className="text-zinc-600 mb-1" />
                  <span className="text-[9px] font-mono uppercase text-zinc-500">
                    Pikir...
                  </span>
                </div>
              )}
            </div>

            {/* Back of Card (Terbuka / Frontface setelah Reveal) */}
            <div className="absolute inset-0 w-full h-full rounded-xl backface-hidden rotate-y-180 bg-zinc-900 border border-indigo-500/40 flex flex-col items-center justify-between p-2 shadow-lg">
              <span className="text-[10px] font-mono text-indigo-400 self-start">
                {participant.vote}
              </span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                {participant.vote}
              </span>
              <span className="text-[10px] font-mono text-indigo-400 self-end">
                {participant.vote}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Participant Name & Badges */}
      <div className="text-center max-w-[90px] sm:max-w-[110px]">
        <p className="text-xs font-medium text-zinc-200 truncate">
          {participant.name}
        </p>
        {participant.isHost && (
          <span className="inline-block text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 mt-0.5">
            Host
          </span>
        )}
      </div>
    </div>
  );
}
