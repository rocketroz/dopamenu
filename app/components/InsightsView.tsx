'use client';

import { motion } from 'framer-motion';
import { X, Flame, CheckCircle, TrendingUp, Star } from 'lucide-react';
import { useDopamenuStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Sparky } from './Sparky';

interface InsightsViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InsightsView({ isOpen, onClose }: InsightsViewProps) {
  const { currentStreak, longestStreak, totalCompletions, categories } = useDopamenuStore();

  // Calculate category breakdown
  const categoryStats = categories.map(cat => ({
    name: cat.name,
    emoji: cat.emoji,
    color: cat.color,
    completions: cat.items.reduce((sum, item) => sum + item.completedCount, 0),
  }));

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const mostUsedCategory = categoryStats.reduce((max, cat) =>
    cat.completions > max.completions ? cat : max,
    { name: '', emoji: '', color: 'cream' as const, completions: 0 }
  );

  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: currentStreak,
      suffix: currentStreak === 1 ? 'day' : 'days',
      color: 'text-coral',
      bgColor: 'bg-coral/10',
    },
    {
      icon: Star,
      label: 'Longest Streak',
      value: longestStreak,
      suffix: longestStreak === 1 ? 'day' : 'days',
      color: 'text-gold',
      bgColor: 'bg-gold/10',
    },
    {
      icon: CheckCircle,
      label: 'Things Done',
      value: totalCompletions,
      suffix: 'total',
      color: 'text-teal',
      bgColor: 'bg-teal/10',
    },
    {
      icon: TrendingUp,
      label: 'Menu Items',
      value: totalItems,
      suffix: 'active',
      color: 'text-cream',
      bgColor: 'bg-cream/10',
    },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-night/95 backdrop-blur-md z-50 overflow-y-auto"
    >
      <div className="min-h-screen max-w-lg mx-auto px-4 py-6 safe-top">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparky mood="celebrating" size="sm" />
            <div>
              <h2 className="text-2xl font-bold text-cream">Your Progress</h2>
              <p className="text-cream/50 text-sm">Keep going!</p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 rounded-xl bg-night-light hover:bg-night-lighter transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-cream/60" />
          </motion.button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                'p-4 rounded-2xl border border-cream/10',
                stat.bgColor
              )}
            >
              <stat.icon className={cn('w-5 h-5 mb-2', stat.color)} />
              <p className={cn('text-3xl font-bold', stat.color)}>
                {stat.value}
              </p>
              <p className="text-cream/50 text-xs">
                {stat.suffix}
              </p>
              <p className="text-cream/70 text-sm mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Category breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-cream/60 text-sm font-medium uppercase tracking-wider mb-4">
            By Category
          </h3>
          <div className="space-y-3">
            {categoryStats.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-night-light border border-cream/5"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <div className="flex-1">
                  <p className="text-cream font-medium">{cat.name}</p>
                  <div className="h-1.5 bg-night rounded-full mt-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: totalCompletions > 0 ? `${(cat.completions / totalCompletions) * 100}%` : 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className={cn(
                        'h-full rounded-full',
                        cat.color === 'coral' && 'bg-coral',
                        cat.color === 'teal' && 'bg-teal',
                        cat.color === 'gold' && 'bg-gold',
                        cat.color === 'cream' && 'bg-cream',
                      )}
                    />
                  </div>
                </div>
                <span className="text-cream/50 text-sm tabular-nums">
                  {cat.completions}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Motivation message */}
        {mostUsedCategory.completions > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="p-4 rounded-2xl bg-teal/10 border border-teal/20 text-center"
          >
            <p className="text-teal">
              You love your {mostUsedCategory.emoji} {mostUsedCategory.name}!
            </p>
            <p className="text-cream/40 text-sm mt-1">
              {mostUsedCategory.completions} completed
            </p>
          </motion.div>
        )}

        {totalCompletions === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-night-light border border-cream/10 text-center"
          >
            <Sparky mood="waving" size="lg" className="mx-auto mb-4" />
            <p className="text-cream font-medium">No activity yet</p>
            <p className="text-cream/40 text-sm mt-1">
              Complete your first item to start tracking!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
