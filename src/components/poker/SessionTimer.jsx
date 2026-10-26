import React, { useState, useEffect, useRef } from 'react';
import { Timer, Stop, CaretDown, Check } from '@phosphor-icons/react';
import { soundFx } from '../../utils/sound';

function formatRemainingTime(seconds) {
  if (seconds <= 0) return 'WAKTU HABIS!';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}j ${minutes < 10 ? '0' : ''}${minutes}m ${secs < 10 ? '0' : ''}${secs}d`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs < 10 ? '0' : ''}${secs}d`;
  }
  return `${secs}d`;
}

const TIMER_PRESETS = [
  { label: '30d', seconds: 30, title: '30 detik' },
  { label: '60d', seconds: 60, title: '60 detik (1 menit)' },
  { label: '90d', seconds: 90, title: '90 detik' },
  { label: '5m', seconds: 300, title: '5 menit' },
  { label: '10m', seconds: 600, title: '10 menit' },
  { label: '1 jam', seconds: 3600, title: '1 jam' },
];

export function SessionTimer({ timerEndTime, isHost, onStartTimer, onStopTimer }) {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [customUnit, setCustomUnit] = useState('menit'); // 'menit' atau 'detik'
  const lastPlayedSecondRef = useRef(null);

  useEffect(() => {
    if (!timerEndTime) {
      setSecondsRemaining(0);
      lastPlayedSecondRef.current = null;
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((timerEndTime - now) / 1000));
      setSecondsRemaining(diff);

      // Efek suara tick pada 5 detik terakhir
      if (diff > 0 && diff <= 5 && lastPlayedSecondRef.current !== diff) {
        lastPlayedSecondRef.current = diff;
        soundFx.playTick();
      }

      // Suara waktu habis
      if (diff === 0 && lastPlayedSecondRef.current !== 0) {
        lastPlayedSecondRef.current = 0;
        soundFx.playTimeUp();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 200);

    return () => clearInterval(interval);
  }, [timerEndTime]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(customValue, 10);
    if (!num || num <= 0) return;

    const totalSeconds = customUnit === 'menit' ? num * 60 : num;
    onStartTimer(totalSeconds);
    setIsCustomOpen(false);
    setCustomValue('');
  };

  const isTimerActive = timerEndTime !== null && secondsRemaining > 0;
  const isUrgent = isTimerActive && secondsRemaining <= 5;

  return (
    <div className="relative flex items-center gap-2">
      {/* Timer Aktif */}
      {timerEndTime ? (
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold transition-all ${
            secondsRemaining === 0
              ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
              : isUrgent
              ? 'bg-amber-950/80 border-amber-500 text-amber-300 animate-bounce'
              : 'bg-zinc-950 border-indigo-500/50 text-indigo-300'
          }`}
        >
          <Timer size={16} className={isUrgent ? 'text-amber-400' : 'text-indigo-400'} />
          <span>{formatRemainingTime(secondsRemaining)}</span>

          {isHost && (
            <button
              type="button"
              onClick={onStopTimer}
              className="ml-1 p-0.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Hentikan Timer"
            >
              <Stop size={14} />
            </button>
          )}
        </div>
      ) : isHost ? (
        /* Host Timer Controls */
        <div className="flex items-center flex-wrap gap-1 bg-zinc-950/90 p-1 rounded-lg border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500 px-1.5 hidden lg:inline">
            Timer:
          </span>

          {/* Quick Presets: 30d, 60d, 90d, 5m, 10m, 1 jam */}
          {TIMER_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onStartTimer(preset.seconds)}
              className="px-2 py-1 rounded text-[11px] font-mono font-medium text-zinc-300 hover:text-indigo-300 hover:bg-zinc-800 transition-colors cursor-pointer active:scale-[0.98]"
              title={preset.title}
            >
              {preset.label}
            </button>
          ))}

          {/* Custom Timer Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCustomOpen(!isCustomOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono font-medium text-indigo-400 hover:text-indigo-300 hover:bg-zinc-800 transition-colors cursor-pointer active:scale-[0.98]"
            title="Tentukan durasi timer kustom"
          >
            <span>Kustom</span>
            <CaretDown size={11} className={isCustomOpen ? 'rotate-180' : ''} />
          </button>
        </div>
      ) : null}

      {/* Popover Custom Timer Form */}
      {isCustomOpen && !timerEndTime && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-xl w-64 backdrop-blur-md">
          <form onSubmit={handleCustomSubmit} className="space-y-2.5">
            <span className="block text-[11px] font-medium text-zinc-300">
              Durasi Timer Kustom:
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="720"
                placeholder="Misal: 15"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
                autoFocus
              />
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 cursor-pointer font-mono"
              >
                <option value="menit">menit</option>
                <option value="detik">detik</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsCustomOpen(false)}
                className="px-2.5 py-1 rounded-lg text-[11px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium transition-colors cursor-pointer active:scale-[0.98]"
              >
                <Check size={12} weight="bold" />
                <span>Mulai</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
