import React from 'react';
import { CardItem } from './CardItem';
import { Users, ShareNetwork } from '@phosphor-icons/react';

export function ParticipantTable({ participants, isRevealed, roomId }) {
  const voters = participants.filter((p) => p.role !== 'SPECTATOR');
  const votedCount = voters.filter((p) => p.vote !== null && p.vote !== undefined).length;

  return (
    <div className="relative w-full my-auto py-8 px-4 sm:px-8 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 flex flex-col items-center justify-center min-h-[340px]">
      {/* Table Center Status Badge */}
      <div className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400 backdrop-blur-sm">
        <Users size={14} className="text-zinc-500" />
        <span>
          {isRevealed
            ? 'Kartu telah dibuka'
            : voters.length > 0
            ? `${votedCount} dari ${voters.length} voter sudah memilih`
            : 'Menunggu voter bergabung'}
        </span>
      </div>

      {/* Participants Cards Grid */}
      {participants.length === 1 && participants[0].isHost ? (
        <div className="flex flex-col items-center justify-center text-center max-w-sm p-4">
          <CardItem participant={participants[0]} isRevealed={isRevealed} />
          <div className="mt-6 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400">
            <div className="flex items-center justify-center gap-1.5 text-zinc-300 font-medium mb-1">
              <ShareNetwork size={16} className="text-indigo-400" />
              <span>Undang Rekan Tim Anda</span>
            </div>
            Bagikan tautan atau kode room <span className="font-mono text-indigo-300 font-semibold">{roomId}</span> ke rekan tim Anda agar mereka dapat bergabung.
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-4xl">
          {participants.map((participant) => (
            <CardItem
              key={participant.id}
              participant={participant}
              isRevealed={isRevealed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
