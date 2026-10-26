import React, { useState } from 'react';
import { Cards, Copy, Check, Users, SignOut } from '@phosphor-icons/react';

export function Navbar({ roomId, participantCount, onLeaveRoom }) {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 h-16 flex items-center justify-between">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Cards size={20} weight="regular" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-zinc-100 flex items-center gap-2">
            Scrum Poker
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              P2P
            </span>
          </h1>
        </div>
      </div>

      {/* Room Info & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Participant Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
          <Users size={16} className="text-zinc-400" />
          <span className="font-medium">{participantCount}</span>
          <span className="hidden sm:inline text-zinc-500">online</span>
        </div>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-200 transition-colors active:scale-[0.98]"
          title="Salin tautan room untuk dibagikan"
        >
          {hasCopied ? (
            <>
              <Check size={15} className="text-emerald-400" />
              <span className="text-emerald-400">Tersalin</span>
            </>
          ) : (
            <>
              <Copy size={15} className="text-zinc-400" />
              <span>Salin Link</span>
            </>
          )}
        </button>

        {/* Leave Room Button */}
        <button
          type="button"
          onClick={onLeaveRoom}
          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/30 text-zinc-400 hover:text-red-400 transition-colors active:scale-[0.98]"
          title="Keluar dari ruangan"
        >
          <SignOut size={16} />
        </button>
      </div>
    </header>
  );
}

