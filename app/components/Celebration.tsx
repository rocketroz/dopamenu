'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDopamenuStore } from '@/lib/store';
import { CELEBRATION_MESSAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const confettiColors = ['#E85A4F', '#1B998B', '#F4C95D', '#EAEAEA'];

function Confetti() {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 1 + Math.random() * 0.5,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    rotation: Math.random() * 360,
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: '110vh',
            rotate: piece.rotation + 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          style={{
            position: 'absolute',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.size > 8 ? '2px' : '50%',
          }}
        />
      ))}
    </div>
  );
}

export function Celebration() {
  const { showCelebration, dismissCelebration, totalCompletions } = useDopamenuStore();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (showCelebration) {
      const randomMessage = CELEBRATION_MESSAGES[
        Math.floor(Math.random() * CELEBRATION_MESSAGES.length)
      ];
      setMessage(randomMessage);

      // Auto dismiss after 2.5 seconds
      const timer = setTimeout(() => {
        dismissCelebration();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [showCelebration, dismissCelebration]);

  return (
    <AnimatePresence>
      {showCelebration && (
        <>
          <Confetti />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed inset-x-4 bottom-24 z-50"
            onClick={dismissCelebration}
          >
            <div className={cn(
              'max-w-sm mx-auto p-6 rounded-2xl text-center',
              'bg-night-light border border-gold/30 shadow-glow-gold'
            )}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
                className="text-4xl mb-3"
              >
                {totalCompletions % 10 === 0 && totalCompletions > 0 ? '🎉' : '✨'}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-cream text-lg font-medium"
              >
                {message}
              </motion.p>

              {totalCompletions > 1 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-cream/40 text-sm mt-2"
                >
                  {totalCompletions} things done
                </motion.p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
