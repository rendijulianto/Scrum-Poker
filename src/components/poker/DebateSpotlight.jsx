import React, { useState, useEffect } from 'react';
import { getDebateSpotlight } from '../../utils/debate';
import { MegaphoneSimple, ArrowsClockwise, ChatCenteredText, User } from '@phosphor-icons/react';

export function DebateSpotlight({ participants, isRevealed }) {
  const [spotlightData, setSpotlightData] = useState(null);

  // Inisialisasi kandidat debat saat kartu di-reveal
  useEffect(() => {
    if (!isRevealed) {
      setSpotlightData(null);
      return;
    }

    const data = getDebateSpotlight(participants);
    setSpotlightData(data);
  }, [isRevealed, participants]);

  // Handler untuk mengocok ulang giliran bicara pertama
  const handleReshuffle = () => {
    if (!spotlightData) return;
    const { minSpeaker, maxSpeaker } = spotlightData;
    const isMinFirst = Math.random() < 0.5;
    setSpotlightData((prev) => ({
      ...prev,
      firstSpeakerId: isMinFirst ? minSpeaker.id : maxSpeaker.id,
    }));
  };

  // Guard: Jika tidak ada spotlight data (misal semua sepakat bulat atau voter < 2)
  if (!isRevealed || !spotlightData) {
    return null;
  }

  const { minSpeaker, maxSpeaker, firstSpeakerId } = spotlightData;
  const isMinSpeakingFirst = firstSpeakerId === minSpeaker.id;

  return (
    <div className="w-full mt-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-indigo-500/30 rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Accent Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-indigo-500/60 blur-sm" />

      {/* Title & Action */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <MegaphoneSimple size={16} weight="fill" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              Sorotan Debat Estimasi
            </h3>
            <span className="text-[11px] text-zinc-400">
              Perbedaan angka terbesar terdeteksi. Silakan dengarkan kedua sudut pandang:
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReshuffle}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] font-medium text-zinc-200 transition-colors active:scale-[0.98]"
          title="Kocok ulang giliran bicara pertama"
        >
          <ArrowsClockwise size={13} />
          <span className="hidden sm:inline">Kocok Giliran</span>
        </button>
      </div>

      {/* VS Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
        {/* Min Voter Card */}
        <div
          className={`relative p-3.5 rounded-xl border transition-all ${
            isMinSpeakingFirst
              ? 'bg-indigo-950/30 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
              : 'bg-zinc-950/60 border-zinc-800 opacity-80'
          }`}
        >
          {isMinSpeakingFirst && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-mono uppercase mb-2">
              <ChatCenteredText size={12} />
              <span>Bicara Pertama</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-zinc-700">
              {minSpeaker.avatar ? (
                <img
                  src={minSpeaker.avatar}
                  alt={minSpeaker.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold">
                  <User size={20} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-200 truncate">
                  {minSpeaker.name}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  {minSpeaker.vote} Poin
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 italic">
                "Kenapa menurutmu tiket ini enteng dan bisa cepat kelar?"
              </p>
            </div>
          </div>
        </div>

        {/* Max Voter Card */}
        <div
          className={`relative p-3.5 rounded-xl border transition-all ${
            !isMinSpeakingFirst
              ? 'bg-indigo-950/30 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
              : 'bg-zinc-950/60 border-zinc-800 opacity-80'
          }`}
        >
          {!isMinSpeakingFirst && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-mono uppercase mb-2">
              <ChatCenteredText size={12} />
              <span>Bicara Pertama</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-zinc-700">
              {maxSpeaker.avatar ? (
                <img
                  src={maxSpeaker.avatar}
                  alt={maxSpeaker.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold">
                  <User size={20} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-200 truncate">
                  {maxSpeaker.name}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60">
                  {maxSpeaker.vote} Poin
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 italic">
                "Apa risiko terbesar atau hal rumit yang kamu temukan di tiket ini?"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
