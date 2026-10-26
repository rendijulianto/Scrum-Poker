import React, { useState, useEffect } from 'react';
import { Eye, ArrowsCounterClockwise, PencilSimple, Check } from '@phosphor-icons/react';

export function SessionHeader({
  topic,
  onUpdateTopic,
  isHost,
  isRevealed,
  onReveal,
  onReset,
  hasVotes,
}) {
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [topicInput, setTopicInput] = useState(topic || '');

  useEffect(() => {
    setTopicInput(topic || '');
  }, [topic]);

  const handleTopicSave = (e) => {
    e.preventDefault();
    onUpdateTopic(topicInput.trim());
    setIsEditingTopic(false);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Topic / Task Section */}
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
          Tiket / Cerita yang Sedang Diestimasi
        </span>

        {isEditingTopic && isHost ? (
          <form onSubmit={handleTopicSave} className="flex items-center gap-2 max-w-lg">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Contoh: PROJ-102: Integrasi Midtrans Payment Gateway"
              className="flex-1 bg-zinc-950 border border-indigo-500 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors active:scale-[0.98]"
              title="Simpan Topik"
            >
              <Check size={16} />
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-medium text-zinc-100 truncate">
              {topic || (
                <span className="text-zinc-500 italic">
                  {isHost ? 'Klik tombol pensil untuk menulis topik sprint...' : 'Menunggu topik dari Host...'}
                </span>
              )}
            </h2>
            {isHost && (
              <button
                type="button"
                onClick={() => setIsEditingTopic(true)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Edit Judul Tiket"
              >
                <PencilSimple size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Host Controls */}
      {isHost && (
        <div className="flex items-center gap-2.5 shrink-0">
          {!isRevealed ? (
            <button
              type="button"
              onClick={onReveal}
              disabled={!hasVotes}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                hasVotes
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              }`}
            >
              <Eye size={16} />
              <span>Buka Kartu</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-medium transition-colors active:scale-[0.98]"
            >
              <ArrowsCounterClockwise size={16} />
              <span>Putaran Baru</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
