'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDopamenuStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type SparkyMood = 'idle' | 'excited' | 'sleepy' | 'celebrating' | 'thinking' | 'waving';

interface SparkyProps {
  mood?: SparkyMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSpeech?: boolean;
  speech?: string;
}

const sizes = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

// Sparky is a friendly little spark/flame character
// Warm colors, simple expressive face, embodies energy and joy
export function Sparky({ mood = 'idle', size = 'md', className, showSpeech, speech }: SparkyProps) {
  const { currentStreak, currentEnergyLevel } = useDopamenuStore();

  // Auto-determine mood based on state if not provided
  const autoMood = (): SparkyMood => {
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) return 'sleepy';
    if (currentStreak >= 7) return 'celebrating';
    if (currentEnergyLevel === 'high') return 'excited';
    if (currentEnergyLevel === 'low') return 'sleepy';
    return 'idle';
  };

  const activeMood = mood || autoMood();

  const moodConfig = {
    idle: {
      bodyAnimation: { scale: [1, 1.02, 1], y: [0, -2, 0] },
      eyeAnimation: { scaleY: [1, 1, 0.1, 1] }, // Occasional blink
      blinkDelay: 3,
    },
    excited: {
      bodyAnimation: { scale: [1, 1.1, 1], y: [0, -8, 0], rotate: [-3, 3, -3] },
      eyeAnimation: { scaleY: 1 },
      blinkDelay: 5,
    },
    sleepy: {
      bodyAnimation: { scale: [1, 0.98, 1], y: [0, 2, 0] },
      eyeAnimation: { scaleY: 0.3 }, // Half-closed eyes
      blinkDelay: 10,
    },
    celebrating: {
      bodyAnimation: { scale: [1, 1.15, 1], y: [0, -12, 0], rotate: [-5, 5, -5, 5, 0] },
      eyeAnimation: { scaleY: 1 },
      blinkDelay: 2,
    },
    thinking: {
      bodyAnimation: { scale: 1, y: 0, rotate: [0, 5, 0] },
      eyeAnimation: { x: [0, 3, 0] },
      blinkDelay: 4,
    },
    waving: {
      bodyAnimation: { scale: [1, 1.05, 1], rotate: [-5, 5, -5] },
      eyeAnimation: { scaleY: 1 },
      blinkDelay: 3,
    },
  };

  const config = moodConfig[activeMood];

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      {/* Speech bubble */}
      <AnimatePresence>
        {showSpeech && speech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-night-light border border-cream/20 rounded-xl px-3 py-1.5 text-sm text-cream shadow-card">
              {speech}
              {/* Speech bubble tail */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-night-light border-r border-b border-cream/20 rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparky body */}
      <motion.div
        className={cn('relative', sizes[size])}
        animate={config.bodyAnimation}
        transition={{
          duration: activeMood === 'celebrating' ? 0.5 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Glow effect */}
          <defs>
            <radialGradient id="sparky-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F4C95D" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#E85A4F" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#E85A4F" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sparky-body" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD86B" />
              <stop offset="50%" stopColor="#F4C95D" />
              <stop offset="100%" stopColor="#E85A4F" />
            </linearGradient>
          </defs>

          {/* Outer glow */}
          <motion.circle
            cx="50"
            cy="55"
            r="45"
            fill="url(#sparky-glow)"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Main body - teardrop/flame shape */}
          <motion.path
            d="M50 10 C65 25 80 45 80 60 C80 80 67 90 50 90 C33 90 20 80 20 60 C20 45 35 25 50 10"
            fill="url(#sparky-body)"
            animate={activeMood === 'excited' ? { d: [
              "M50 10 C65 25 80 45 80 60 C80 80 67 90 50 90 C33 90 20 80 20 60 C20 45 35 25 50 10",
              "M50 5 C70 20 85 45 85 60 C85 82 67 92 50 92 C33 92 15 82 15 60 C15 45 30 20 50 5",
              "M50 10 C65 25 80 45 80 60 C80 80 67 90 50 90 C33 90 20 80 20 60 C20 45 35 25 50 10",
            ]} : undefined}
            transition={{ duration: 0.8, repeat: Infinity }}
          />

          {/* Inner highlight */}
          <ellipse cx="40" cy="45" rx="12" ry="18" fill="rgba(255,255,255,0.3)" />

          {/* Face container */}
          <g transform="translate(0, 5)">
            {/* Left eye */}
            <motion.ellipse
              cx="38"
              cy="52"
              rx="6"
              ry="7"
              fill="#1A1A2E"
              animate={config.eyeAnimation}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: config.blinkDelay,
              }}
            />
            {/* Left eye sparkle */}
            <circle cx="36" cy="50" r="2" fill="white" />

            {/* Right eye */}
            <motion.ellipse
              cx="62"
              cy="52"
              rx="6"
              ry="7"
              fill="#1A1A2E"
              animate={config.eyeAnimation}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: config.blinkDelay,
              }}
            />
            {/* Right eye sparkle */}
            <circle cx="60" cy="50" r="2" fill="white" />

            {/* Mouth - changes based on mood */}
            {activeMood === 'sleepy' ? (
              // Sleepy mouth - small o
              <ellipse cx="50" cy="68" rx="4" ry="3" fill="#1A1A2E" />
            ) : activeMood === 'celebrating' || activeMood === 'excited' ? (
              // Big smile
              <path
                d="M38 65 Q50 78 62 65"
                fill="none"
                stroke="#1A1A2E"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : (
              // Normal smile
              <path
                d="M42 66 Q50 72 58 66"
                fill="none"
                stroke="#1A1A2E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Blush marks when excited/celebrating */}
            {(activeMood === 'excited' || activeMood === 'celebrating') && (
              <>
                <ellipse cx="28" cy="58" rx="5" ry="3" fill="#E85A4F" opacity="0.5" />
                <ellipse cx="72" cy="58" rx="5" ry="3" fill="#E85A4F" opacity="0.5" />
              </>
            )}
          </g>

          {/* Sparkles around Sparky when celebrating */}
          {activeMood === 'celebrating' && (
            <>
              <motion.circle
                cx="15"
                cy="30"
                r="3"
                fill="#F4C95D"
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.circle
                cx="85"
                cy="25"
                r="2"
                fill="#E85A4F"
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              />
              <motion.circle
                cx="90"
                cy="50"
                r="2.5"
                fill="#1B998B"
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
              />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
}

// Pre-defined Sparky states with speech
export function SparkyGreeting() {
  const hour = new Date().getHours();
  const { currentStreak } = useDopamenuStore();

  let speech = "Hey there!";
  let mood: SparkyMood = 'waving';

  if (hour < 6) {
    speech = "Can't sleep?";
    mood = 'sleepy';
  } else if (hour < 12) {
    speech = "Good morning!";
    mood = 'waving';
  } else if (hour < 17) {
    speech = "How's it going?";
    mood = 'idle';
  } else if (hour < 21) {
    speech = "Evening vibes!";
    mood = 'idle';
  } else {
    speech = "Winding down?";
    mood = 'sleepy';
  }

  if (currentStreak >= 7) {
    speech = `${currentStreak} days! 🔥`;
    mood = 'celebrating';
  }

  return <Sparky mood={mood} showSpeech speech={speech} size="lg" />;
}
