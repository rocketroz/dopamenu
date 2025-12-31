'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Utensils, Rocket } from 'lucide-react';
import { useDopamenuStore } from '@/lib/store';
import { triggerHaptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';

const slides = [
  {
    icon: Sparkles,
    title: 'Your energy is a menu',
    body: 'Some days you want a snack. Some days a feast. No judgment, just options.',
    color: 'coral',
    emoji: '🍽️',
  },
  {
    icon: Utensils,
    title: 'Pick what fuels you',
    body: 'Appetizers for quick wins. Entrees for deep dives. Desserts for pure joy.',
    color: 'teal',
    emoji: '⚡',
  },
  {
    icon: Rocket,
    title: "Let's go",
    body: "We've added some ideas to start. Make them yours, or clear and start fresh.",
    color: 'gold',
    emoji: '🚀',
  },
];

const colorStyles = {
  coral: {
    iconBg: 'bg-coral/20',
    iconColor: 'text-coral',
    dotActive: 'bg-coral',
    button: 'bg-coral shadow-[0_6px_0_0_#B54840]',
    buttonPressed: 'shadow-[0_2px_0_0_#B54840]',
  },
  teal: {
    iconBg: 'bg-teal/20',
    iconColor: 'text-teal',
    dotActive: 'bg-teal',
    button: 'bg-teal shadow-[0_6px_0_0_#147A6E]',
    buttonPressed: 'shadow-[0_2px_0_0_#147A6E]',
  },
  gold: {
    iconBg: 'bg-gold/20',
    iconColor: 'text-gold',
    dotActive: 'bg-gold',
    button: 'bg-gold shadow-[0_6px_0_0_#C9A34B] text-night',
    buttonPressed: 'shadow-[0_2px_0_0_#C9A34B]',
  },
};

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { completeOnboarding } = useDopamenuStore();

  const slide = slides[currentSlide];
  const styles = colorStyles[slide.color as keyof typeof colorStyles];
  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    triggerHaptic('light');

    if (isLastSlide) {
      triggerHaptic('success');
      completeOnboarding();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    triggerHaptic('light');
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 bg-night flex flex-col items-center justify-center p-6 safe-top safe-bottom overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating emoji */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            {['🍿', '🥗', '🍝', '🍰', '✨'][i]}
          </motion.div>
        ))}

        {/* Gradient orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-coral/10 blur-3xl"
          style={{ top: '-10%', right: '-20%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-teal/10 blur-3xl"
          style={{ bottom: '-10%', left: '-20%' }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Skip button */}
      <motion.button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-cream/40 hover:text-cream text-sm transition-colors z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Skip
      </motion.button>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Icon container with pulsing glow */}
            <div className="relative mb-8 inline-block">
              <motion.div
                className={cn(
                  'absolute inset-0 rounded-3xl blur-xl',
                  styles.iconBg
                )}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className={cn(
                  'relative w-28 h-28 rounded-3xl flex items-center justify-center',
                  styles.iconBg
                )}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              >
                <motion.span
                  className="text-5xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                >
                  {slide.emoji}
                </motion.span>
              </motion.div>
            </div>

            {/* Title */}
            <motion.h1
              className="text-3xl font-bold text-cream mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {slide.title}
            </motion.h1>

            {/* Body */}
            <motion.p
              className="text-cream/60 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {slide.body}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="w-full max-w-sm space-y-6 relative z-10">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                triggerHaptic('selection');
                setCurrentSlide(idx);
              }}
              className="relative h-2"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className={cn(
                  'h-2 rounded-full transition-colors',
                  idx === currentSlide
                    ? styles.dotActive
                    : 'bg-cream/20 hover:bg-cream/40'
                )}
                animate={{
                  width: idx === currentSlide ? 32 : 8,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.button>
          ))}
        </div>

        {/* Button - 3D press effect */}
        <motion.button
          onClick={handleNext}
          className={cn(
            'w-full py-4 rounded-2xl font-semibold text-lg',
            'flex items-center justify-center gap-2',
            'text-white relative overflow-hidden',
            styles.button,
            'active:translate-y-1',
            styles.buttonPressed.replace('shadow', 'active:shadow'),
            'transition-all duration-75'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ y: 4 }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 1,
            }}
          />

          {/* Top highlight */}
          <span className="absolute inset-x-0 top-0 h-[2px] bg-white/30 rounded-t-2xl" />

          <span className="relative">{isLastSlide ? "Let's eat" : 'Continue'}</span>
          <motion.span
            className="relative"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}
