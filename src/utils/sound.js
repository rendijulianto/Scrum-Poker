/**
 * Audio Synthesizer murni menggunakan Web Audio API.
 * Berjalan 100% di browser tanpa butuh file audio eksternal dan bebas latensi.
 */

class SoundEffects {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('poker_sound_muted') === 'true';
  }

  getAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  setMuted(muted) {
    this.isMuted = muted;
    localStorage.setItem('poker_sound_muted', muted ? 'true' : 'false');
  }

  getMuted() {
    return this.isMuted;
  }

  // Suara Detik Timer (Tick) pada 5 detik terakhir
  playTick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (_) {}
  }

  // Suara Waktu Habis (Double Beep Alert)
  playTimeUp() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      [0, 0.15].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime + delay); // D5

        gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.12);
      });
    } catch (_) {}
  }

  // Suara Kartu Diklik / Dipilih
  playCardSelect() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (_) {}
  }

  // Suara Buka Kartu (Whoosh/Reveal)
  playReveal() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (_) {}
  }

  // Suara Konsensus Sepakat Bulat (Fanfare Chord)
  playConsensus() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      // Chord C Major Arpeggio: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, index) => {
        const delay = index * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

        gain.gain.setValueAtTime(0.18, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.35);
      });
    } catch (_) {}
  }

  // Suara Lucu Khusus Emoji Reaction (Gabungan Web Audio Synth + Web Speech Bahasa Indonesia)
  playEmojiSound(emoji) {
    if (this.isMuted) return;

    // 1. Efek Sintesis Web Audio Taktil
    try {
      const ctx = this.getAudioContext();
      if (ctx) {
        if (emoji === '☕') {
          // Suara tetesan / sruput air (slurp pop)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        } else if (emoji === '🔥') {
          // Suara api / laser menyala
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        } else if (emoji === '💀') {
          // Suara bonk / thud komikal
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        } else if (emoji === '🚀') {
          // Suara roket meluncur
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(200, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.25);
          gain.gain.setValueAtTime(0.18, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        } else if (emoji === '🤔') {
          // Suara boing per kartun
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(350, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.08);
          osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.16);
          gain.gain.setValueAtTime(0.18, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.16);
        } else if (emoji === '🎉') {
          // Suara terompet pesta
          const notes = [659.25, 880, 1046.5];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
            gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.05);
            osc.stop(ctx.currentTime + idx * 0.05 + 0.15);
          });
        }
      }
    } catch (_) {}

    // 2. Efek Suara Komentar Lucu via Web Speech Synthesis (Bahasa Indonesia)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const voiceLines = {
          '☕': [
            'Ngopi dulu bro!',
            'Srupuuut! Santai dulu gak sih',
            'Kopi mana kopi?',
          ],
          '🔥': [
            'Menyala abangku!',
            'Gokil panas membara!',
            'Keras lur!',
          ],
          '💀': [
            'Waduh beban sprint!',
            'Tidur aja udah tidur',
            'Hilang harapan boss!',
          ],
          '🚀': [
            'Gaskeun jangan kasih kendor!',
            'Meluncur ke production!',
            'Gas pol rem blong!',
          ],
          '🤔': [
            'Hmm mencurigakan...',
            'Kok bisa gitu ya?',
            'Overthinking dimulai nih',
          ],
          '🎉': [
            'Mantap jiwa!',
            'Gajian cair kawan-kawan!',
            'Sepakat bulat horeee!',
          ],
        };

        const list = voiceLines[emoji];
        if (list && list.length > 0) {
          const text = list[Math.floor(Math.random() * list.length)];
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'id-ID';

          // Karakter pitch dan rate lucu
          if (emoji === '☕') {
            utterance.pitch = 1.2;
            utterance.rate = 1.1;
          } else if (emoji === '🔥') {
            utterance.pitch = 1.35;
            utterance.rate = 1.25;
          } else if (emoji === '💀') {
            utterance.pitch = 0.75;
            utterance.rate = 0.95;
          } else if (emoji === '🚀') {
            utterance.pitch = 1.4;
            utterance.rate = 1.2;
          } else if (emoji === '🤔') {
            utterance.pitch = 1.25;
            utterance.rate = 1.0;
          } else if (emoji === '🎉') {
            utterance.pitch = 1.45;
            utterance.rate = 1.2;
          }

          window.speechSynthesis.cancel(); // Batalkan antrean lama agar tidak menumpuk
          window.speechSynthesis.speak(utterance);
        }
      } catch (_) {}
    }
  }
}

export const soundFx = new SoundEffects();

