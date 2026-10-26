import React, { useState, useEffect, useRef } from 'react';
import { Timer, Stop, Play } from '@phosphor-icons/react';
import { soundFx } from '../../utils/sound';

export function SessionTimer({ timerEndTime, isHost, onStartTimer, onStopTimer }) {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
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

      // Mainkan efek suara pada 5 detik terakhir
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

  const isTimerActive = timerEndTime !== null && secondsRemaining > 0;
  const isUrgent = isTimerActive && secondsRemaining <= 5;

  return (
    <div className="flex items-center gap-2">
      {/* Timer Display Badge */}
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
          <span>{secondsRemaining === 0 ? 'WAKTU HABIS!' : `${secondsRemaining}d`}</span>

          {isHost && (
            <button
              type="button"
              onClick={onStopTimer}
              className="ml-1 p-0.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
              title="Hentikan Timer"
            >
              <Stop size={14} />
            </button>
          )}
        </div>
      ) : isHost ? (
        /* Host Controls to trigger timer */
        <div className="flex items-center gap-1 bg-zinc-950/90 p-1 rounded-lg border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500 px-1.5 hidden sm:inline">
            Timer:
          </span>
          <button
            type="button"
            onClick={() => onStartTimer(30)}
            className="px-2 py-1 rounded text-[11px] font-mono font-medium text-zinc-300 hover:text-indigo-300 hover:bg-zinc-800 transition-colors active:scale-[0.98]"
            title="Mulai timer 30 detik"
          >
            30d
          </button>
          <button
            type="button"
            onClick={() => onStartTimer(60)}
            className="px-2 py-1 rounded text-[11px] font-mono font-medium text-zinc-300 hover:text-indigo-300 hover:bg-zinc-800 transition-colors active:scale-[0.98]"
            title="Mulai timer 60 detik"
          >
            60d
          </button>
          <button
            type="button"
            onClick={() => onStartTimer(90)}
            className="px-2 py-1 rounded text-[11px] font-mono font-medium text-zinc-300 hover:text-indigo-300 hover:bg-zinc-800 transition-colors active:scale-[0.98]"
            title="Mulai timer 90 detik"
          >
            90d
          </button>
        </div>
      ) : null}
    </div>
  );
}
