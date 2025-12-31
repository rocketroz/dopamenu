'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, Shuffle } from 'lucide-react';
import { Category } from '@/lib/types';
import { useDopamenuStore } from '@/lib/store';
import { triggerHaptic } from '@/lib/haptics';
import { playSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import { MenuItem } from './MenuItem';
import { AddItemModal } from './AddItemModal';

interface CategoryCardProps {
  category: Category;
  index: number;
}

const colorStyles = {
  coral: {
    bg: 'bg-coral/5',
    border: 'border-coral/20',
    accent: 'text-coral',
    glow: 'shadow-glow-coral',
    button: 'bg-coral hover:bg-coral-dark',
  },
  teal: {
    bg: 'bg-teal/5',
    border: 'border-teal/20',
    accent: 'text-teal',
    glow: 'shadow-glow-teal',
    button: 'bg-teal hover:bg-teal-dark',
  },
  gold: {
    bg: 'bg-gold/5',
    border: 'border-gold/20',
    accent: 'text-gold',
    glow: 'shadow-glow-gold',
    button: 'bg-gold hover:bg-gold-dark text-night',
  },
  cream: {
    bg: 'bg-cream/5',
    border: 'border-cream/20',
    accent: 'text-cream',
    glow: 'shadow-card',
    button: 'bg-cream hover:bg-cream-dark text-night',
  },
};

const rotations = ['rotate-card-1', 'rotate-card-2', 'rotate-card-3', 'rotate-card-4'];

export function CategoryCard({ category, index }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const { getFilteredItems, getRandomItem, setLastPickedItem } = useDopamenuStore();
  const filteredItems = getFilteredItems(category.id);
  const styles = colorStyles[category.color];

  const handleShuffle = async () => {
    if (filteredItems.length === 0) return;

    setIsShuffling(true);
    triggerHaptic('light');
    playSound('shuffle');

    // Shuffle animation timing
    await new Promise(resolve => setTimeout(resolve, 600));

    const randomItem = getRandomItem(category.id);
    if (randomItem) {
      setLastPickedItem(randomItem);
      triggerHaptic('success');
      playSound('reveal');
    }

    setIsShuffling(false);
    setIsExpanded(true);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className={cn(
          'relative overflow-hidden rounded-2xl border card-texture',
          styles.bg,
          styles.border,
          rotations[index % 4],
          'hover:rotate-0 transition-transform duration-300'
        )}
      >
        {/* Header */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center justify-between text-left"
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-4">
            <motion.span
              className="text-3xl"
              animate={isShuffling ? { rotate: [0, 360] } : {}}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {category.emoji}
            </motion.span>
            <div>
              <h2 className={cn('text-xl font-bold tracking-tight', styles.accent)}>
                {category.name}
              </h2>
              <p className="text-cream/60 text-sm mt-0.5">
                {category.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-cream/40 text-sm tabular-nums">
              {filteredItems.length}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-cream/40" />
            </motion.div>
          </div>
        </motion.button>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-3">
                {/* Description */}
                <p className="text-cream/50 text-sm">
                  {category.description}
                </p>

                {/* Items */}
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, idx) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        categoryId={category.id}
                        index={idx}
                      />
                    ))}
                  </AnimatePresence>

                  {filteredItems.length === 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6 text-cream/40 text-sm"
                    >
                      Nothing here yet. Add something good.
                    </motion.p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                  <motion.button
                    onClick={() => setShowAddModal(true)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl',
                      'bg-night-light hover:bg-night-lighter border border-cream/10',
                      'text-cream text-sm font-medium transition-colors'
                    )}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </motion.button>

                  {filteredItems.length > 0 && (
                    <motion.button
                      onClick={handleShuffle}
                      disabled={isShuffling}
                      className={cn(
                        'flex items-center justify-center gap-2 px-4 py-3 rounded-xl',
                        styles.button,
                        'text-sm font-medium transition-colors'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={isShuffling ? { x: [-2, 2, -2, 2, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <Shuffle className={cn('w-4 h-4', isShuffling && 'animate-spin')} />
                      Pick one
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categoryId={category.id}
        categoryColor={category.color}
      />
    </>
  );
}
