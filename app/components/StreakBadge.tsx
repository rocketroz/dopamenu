'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useDopamenuStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function StreakBadge() {
  const { currentStreak, totalCompletions } = useDopamenuStore();

  if (currentStreak === 0 && totalCompletions === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="flex items-center gap-3"
    >
      {/* Streak counter */}
      {currentStreak > 0 && (
        <motion.div
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
            'bg-coral/10 border border-coral/20'
          )}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut',
            }}
          >
            <Flame className="w-4 h-4 text-coral" />
          </motion.div>
          <span className="text-coral font-bold tabular-nums">
            {currentStreak}
          </span>
        </motion.div>
      )}

      {/* Completion counter */}
      {totalCompletions > 0 && (
        <motion.div
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
            'bg-teal/10 border border-teal/20'
          )}
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-teal text-sm">
            {totalCompletions} done
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
