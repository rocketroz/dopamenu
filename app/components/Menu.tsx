'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useDopamenuStore } from '@/lib/store';
import { CategoryCard } from './CategoryCard';
import { EnergySelector } from './EnergySelector';
import { QuickPick } from './QuickPick';
import { StreakBadge } from './StreakBadge';
import { SoundToggle } from './SoundToggle';
import { InsightsView } from './InsightsView';
import { ParticlePlayground } from './ParticlePlayground';
import { Sparky, SparkyGreeting } from './Sparky';
import { getGreeting } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Menu() {
  const { categories, updateStreak } = useDopamenuStore();
  const [showInsights, setShowInsights] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

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
            <div className="flex items-center gap-3">
              {/* Small Sparky in header */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <Sparky size="sm" />
              </motion.div>
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
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <SoundToggle />
              <div onClick={() => setShowInsights(true)} className="cursor-pointer">
                <StreakBadge />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-32">
        {/* Hero greeting with Sparky */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center py-4"
        >
          <SparkyGreeting />
        </motion.section>

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

        {/* Footer with Sparky tip and Zen Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center py-6 gap-4"
        >
          {/* Zen Mode Button */}
          <motion.button
            onClick={() => setShowParticles(true)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-2xl',
              'bg-gradient-to-r from-night-light to-night-lighter',
              'border border-cream/10 hover:border-gold/30',
              'text-cream/70 hover:text-cream',
              'transition-all duration-300',
              'shadow-card hover:shadow-glow-gold'
            )}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="font-medium">Zen Mode</span>
            <span className="text-xs text-cream/40 ml-1">with hand tracking</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <Sparky mood="idle" size="sm" />
            <p className="text-center text-cream/20 text-xs">
              Tap a category to explore your options.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Insights View */}
      <AnimatePresence>
        {showInsights && (
          <InsightsView
            isOpen={showInsights}
            onClose={() => setShowInsights(false)}
          />
        )}
      </AnimatePresence>

      {/* Particle Playground */}
      <AnimatePresence>
        {showParticles && (
          <ParticlePlayground
            isOpen={showParticles}
            onClose={() => setShowParticles(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
