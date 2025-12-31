'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDopamenuStore } from '@/lib/store';
import { CategoryCard } from './CategoryCard';
import { EnergySelector } from './EnergySelector';
import { QuickPick } from './QuickPick';
import { StreakBadge } from './StreakBadge';
import { getGreeting } from '@/lib/constants';

export function Menu() {
  const { categories, updateStreak } = useDopamenuStore();

  // Update streak on mount
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  return (
    <div className="min-h-screen bg-night">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-night/80 backdrop-blur-lg border-b border-cream/5">
        <div className="max-w-lg mx-auto px-4 py-4 safe-top">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <motion.h1
                className="text-2xl font-bold text-gradient"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Dopamenu
              </motion.h1>
              <motion.p
                className="text-cream/50 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {getGreeting()}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StreakBadge />
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-32">
        {/* Energy selector */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EnergySelector />
        </motion.section>

        {/* Quick pick - THE main interaction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <QuickPick />
        </motion.section>

        {/* Categories */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <h2 className="text-cream/40 text-sm font-medium uppercase tracking-wider">
              The Menu
            </h2>
            <span className="text-cream/20 text-xs">
              {categories.reduce((acc, c) => acc + c.items.length, 0)} items
            </span>
          </div>

          <div className="space-y-3">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </motion.section>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-cream/20 text-xs py-4"
        >
          Tap a category to explore. Swipe for more.
        </motion.p>
      </main>
    </div>
  );
}
