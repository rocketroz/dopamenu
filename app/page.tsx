'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDopamenuStore } from '@/lib/store';
import { Menu } from './components/Menu';
import { Onboarding } from './components/Onboarding';
import { Celebration } from './components/Celebration';

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { hasCompletedOnboarding } = useDopamenuStore();

  // Wait for hydration to prevent flash
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className="relative"
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-coral/20 blur-3xl rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut',
            }}
          />

          {/* Logo text */}
          <motion.h1
            className="text-gradient text-4xl font-bold relative z-10"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
            }}
          >
            Dopamenu
          </motion.h1>

          {/* Loading dots */}
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-coral"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={hasCompletedOnboarding ? 'menu' : 'onboarding'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {hasCompletedOnboarding ? <Menu /> : <Onboarding />}
      </motion.div>
      <Celebration />
    </AnimatePresence>
  );
}
