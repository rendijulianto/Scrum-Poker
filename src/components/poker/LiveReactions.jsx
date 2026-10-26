import React from 'react';
import { Smiley } from '@phosphor-icons/react';

const EMOJI_OPTIONS = ['☕', '🔥', '💀', '🚀', '🤔', '🎉'];

export function LiveReactions({ reactions, onSendReaction }) {
  return (
    <>
      {/* Floating Animated Emojis Container */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
        {reactions.map((item) => (
          <div
            key={item.id}
            style={{
              left: `${item.xOffset}%`,
              bottom: '90px',
              animation: 'floatUp 2.4s ease-out forwards',
            }}
            className="absolute flex flex-col items-center gap-1 select-none"
          >
            <span className="text-3xl sm:text-4xl filter drop-shadow-md">
              {item.emoji}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950/80 border border-zinc-700/60 text-zinc-300 backdrop-blur-sm shadow-sm">
              {item.senderName}
            </span>
          </div>
        ))}
      </div>

      {/* Fixed Bottom-Left Reactions Dock */}
      <div className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-1 bg-zinc-950/90 border border-zinc-800/90 rounded-full px-2.5 py-1.5 shadow-lg backdrop-blur-md">
        <Smiley size={15} className="text-zinc-500 mr-1" />
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSendReaction(emoji)}
            className="w-8 h-8 rounded-full hover:bg-zinc-800 flex items-center justify-center text-base transition-transform active:scale-[0.85] hover:scale-115"
            title={`Kirim reaksi ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
}
