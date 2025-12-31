'use client';

// Sound design for Dopamenu
// Based on UX sound design best practices:
// - Sounds should be short and subtle
// - More frequent sounds = more subtle
// - Respect device mute switch
// - Provide option to disable

type SoundType = 'tap' | 'success' | 'shuffle' | 'reveal' | 'celebrate' | 'whoosh';

// Audio context for web audio API
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
};

// Generate sounds programmatically (no external files needed)
const soundGenerators: Record<SoundType, (ctx: AudioContext) => void> = {
  tap: (ctx) => {
    // Quick, subtle click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  },

  success: (ctx) => {
    // Warm, satisfying two-note chime
    const playNote = (freq: number, delay: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };
    playNote(523.25, 0, 0.15); // C5
    playNote(659.25, 0.1, 0.2); // E5
  },

  shuffle: (ctx) => {
    // Quick clicking sounds like a slot machine
    const playClick = (delay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(200 + Math.random() * 100, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.05, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.02);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.02);
    };
    for (let i = 0; i < 5; i++) {
      playClick(i * 0.05);
    }
  },

  reveal: (ctx) => {
    // Satisfying "pop" reveal
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  },

  celebrate: (ctx) => {
    // Triumphant fanfare
    const playNote = (freq: number, delay: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };
    playNote(392, 0, 0.15);    // G4
    playNote(523.25, 0.12, 0.15); // C5
    playNote(659.25, 0.24, 0.15); // E5
    playNote(783.99, 0.36, 0.3);  // G5
  },

  whoosh: (ctx) => {
    // Subtle transition sound
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(ctx.currentTime);
  },
};

// Sound preferences stored in localStorage
const SOUND_ENABLED_KEY = 'dopamenu-sound-enabled';

export const isSoundEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(SOUND_ENABLED_KEY);
  return stored === null ? true : stored === 'true';
};

export const setSoundEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
};

export const playSound = (type: SoundType): void => {
  if (!isSoundEnabled()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume audio context if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  try {
    soundGenerators[type](ctx);
  } catch (e) {
    // Silently fail if audio doesn't work
    console.debug('Sound playback failed:', e);
  }
};

// Hook for components
export const useSound = () => {
  return {
    play: playSound,
    isEnabled: isSoundEnabled,
    setEnabled: setSoundEnabled,
  };
};
