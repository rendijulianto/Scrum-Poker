import React, { useState } from 'react';
import { X, Copy, Check, DownloadSimple, Trash, ListBullets, Sparkle } from '@phosphor-icons/react';
import { formatHistoryAsMarkdown, downloadHistoryAsCsv } from '../../utils/export';

export function SprintHistoryModal({ isOpen, onClose, history, isHost, onClearHistory }) {
  const [hasCopied, setHasCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    const text = formatHistoryAsMarkdown(history);
    navigator.clipboard.writeText(text).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  const handleDownloadCsv = () => {
    downloadHistoryAsCsv(history);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ListBullets size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Riwayat Estimasi Tiket
              </h3>
              <span className="text-[11px] text-zinc-400">
                Total {history.length} tiket telah diestimasi
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Table */}
        <div className="flex-1 overflow-y-auto p-5">
          {history.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              <p>Belum ada tiket yang selesai diestimasi.</p>
              <p className="mt-1 text-[11px] text-zinc-600">
                Setiap kali Host menekan tombol Putaran Baru, hasil estimasi akan tersimpan di sini.
              </p>
            </div>
          ) : (
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="py-2.5 px-3 w-10">No</th>
                    <th className="py-2.5 px-3">Judul Tiket</th>
                    <th className="py-2.5 px-3 text-center">Poin</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/40">
                  {history.map((item, index) => (
                    <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono text-zinc-500">{index + 1}</td>
                      <td className="py-3 px-3 font-medium text-zinc-200 max-w-[240px] truncate">
                        {item.topic}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-indigo-400 text-sm">
                          {item.average !== null ? item.average : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.isConsensus ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                            <Sparkle size={10} weight="fill" />
                            Sepakat
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            Beragam
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-zinc-500 text-[11px]">
                        {item.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer / Actions */}
        {history.length > 0 && (
          <div className="px-5 py-3.5 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-2">
            {isHost ? (
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <Trash size={14} />
                <span>Hapus Semua</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-zinc-200 transition-colors active:scale-[0.98]"
                title="Salin tabel format Markdown untuk Jira / Linear / Notion"
              >
                {hasCopied ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="text-zinc-400" />
                    <span>Salin Markdown</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors active:scale-[0.98]"
              >
                <DownloadSimple size={14} />
                <span>Download CSV</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

