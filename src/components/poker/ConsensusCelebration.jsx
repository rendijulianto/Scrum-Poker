import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { checkConsensus } from '../../utils/math';

export function ConsensusCelebration({ isRevealed, participants }) {
  useEffect(() => {
    if (!isRevealed) return;

    const isConsensus = checkConsensus(participants);
    if (!isConsensus) return;

    // Tembakkan confetti selebrasi konsensus
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#818cf8', '#a5b4fc', '#ffffff'],
      });
    } catch (err) {
      console.warn('Gagal memicu efek confetti:', err);
    }
  }, [isRevealed, participants]);

  return null;
}
