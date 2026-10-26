import React from 'react';
import { TEAM_AVATARS } from '../../constants/avatars';
import { Check, Smiley } from '@phosphor-icons/react';

export function AvatarPicker({ selectedAvatar, onSelectAvatar }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
          <Smiley size={15} className="text-indigo-400" />
          <span>Pilih Karakter Wajah Tim</span>
        </label>
        <span className="text-[11px] text-zinc-500 font-mono">
          {TEAM_AVATARS.find((a) => a.src === selectedAvatar)?.title || 'Pilih avatar'}
        </span>
      </div>

      {/* Avatars Row */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none">
        {TEAM_AVATARS.map((avatar) => {
          const isSelected = selectedAvatar === avatar.src;

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelectAvatar(avatar.src)}
              title={avatar.title}
              className={`relative shrink-0 w-12 h-12 rounded-full transition-all duration-150 active:scale-[0.95] ${
                isSelected
                  ? 'ring-2 ring-offset-2 ring-offset-zinc-950 ring-indigo-500 scale-105'
                  : 'opacity-70 hover:opacity-100 hover:scale-102 border border-zinc-700/60'
              }`}
            >
              <img
                src={avatar.src}
                alt={avatar.title}
                className="w-full h-full rounded-full object-cover"
                loading="lazy"
              />
              {isSelected && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-600 border border-zinc-950 flex items-center justify-center text-white">
                  <Check size={10} weight="bold" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
