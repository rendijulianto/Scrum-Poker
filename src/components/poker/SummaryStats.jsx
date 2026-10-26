import React, { useMemo } from 'react';
import { calculateAverage, calculateDistribution, checkConsensus } from '../../utils/math';
import { ChartBar, Sparkle } from '@phosphor-icons/react';

export function SummaryStats({ participants }) {
  const average = useMemo(() => calculateAverage(participants), [participants]);
  const distribution = useMemo(() => calculateDistribution(participants), [participants]);
  const isConsensus = useMemo(() => checkConsensus(participants), [participants]);

  return (
    <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 sm:p-5 mt-4">
      <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
        <ChartBar size={16} className="text-indigo-400" />
        <span>Hasil Estimasi Tim</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Metric 1: Rata-rata */}
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/80">
          <span className="text-[11px] font-mono text-zinc-500 uppercase block">
            Rata-rata Poin
          </span>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-400 mt-1 block">
            {average !== null ? average : 'N/A'}
          </span>
        </div>

        {/* Metric 2: Kesepakatan (Consensus) */}
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/80">
          <span className="text-[11px] font-mono text-zinc-500 uppercase block">
            Status Konsensus
          </span>
          <div className="flex items-center gap-2 mt-1">
            {isConsensus ? (
              <span className="text-emerald-400 font-semibold text-lg flex items-center gap-1.5">
                <Sparkle size={18} weight="fill" />
                Sepakat Bulat
              </span>
            ) : (
              <span className="text-zinc-300 font-medium text-base">
                Perlu Diskusi
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Pilihan Terbanyak */}
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/80">
          <span className="text-[11px] font-mono text-zinc-500 uppercase block">
            Nilai Terbanyak
          </span>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-200 mt-1 block">
            {distribution.length > 0 ? `${distribution[0].value} (${distribution[0].count} suara)` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Distribution Chips */}
      <div>
        <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-2">
          Penyebaran Suara:
        </span>
        <div className="flex flex-wrap gap-2">
          {distribution.map(({ value, count }) => (
            <div
              key={value}
              className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center gap-2 text-xs"
            >
              <span className="font-bold text-indigo-400 font-mono text-sm">{value}</span>
              <span className="text-zinc-400 text-[11px]">{count} orang</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

