'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Shuffle, Check, X, RotateCcw } from 'lucide-react';
import { useDopamenuStore } from '@/lib/store';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { CategoryType } from '@/lib/types';
import { triggerHaptic } from '@/lib/haptics';
import { playSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import { ReflectionModal } from './ReflectionModal';

export function QuickPick() {
  const [isShuffling, setIsShuffling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [shuffleTexts, setShuffleTexts] = useState<string[]>([]);
  const [currentShuffleIndex, setCurrentShuffleIndex] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [completedItemName, setCompletedItemName] = useState('');

  const controls = useAnimation();

  const {
    categories,
    lastPickedItem,
    setLastPickedItem,
    getRandomItem,
    completeMenuItem
  } = useDopamenuStore();

  const allItems = categories.flatMap(c => c.items.map(i => ({ ...i, categoryId: c.id })));

  const handleShuffle = async () => {
    if (allItems.length === 0) return;

    setIsShuffling(true);
    setShowResult(false);
    triggerHaptic('light');
    playSound('shuffle');

    // Create shuffle animation texts
    const shuffleSequence = Array.from({ length: 10 }, () => {
      const idx = Math.floor(Math.random() * allItems.length);
      return allItems[idx].name;
    });
    setShuffleTexts(shuffleSequence);

    // Animate through texts with increasing delays (slot machine effect)
    for (let i = 0; i < shuffleSequence.length; i++) {
      setCurrentShuffleIndex(i);

      // Haptic on each "stop"
      if (i > 5) {
        triggerHaptic('light');
      }

      await new Promise(resolve => setTimeout(resolve, 60 + i * 30));
    }

    // Final reveal with strong haptic and sound
    triggerHaptic('success');
    playSound('reveal');

    // Pick final result
    const picked = getRandomItem();
    if (picked) {
      setLastPickedItem(picked);
      setShowResult(true);

      // Bounce animation on reveal
      await controls.start({
        scale: [0.9, 1.05, 1],
        transition: { duration: 0.4, ease: 'easeOut' }
      });
    }

    setIsShuffling(false);
  };

  const handleComplete = () => {
    if (!lastPickedItem) return;

    triggerHaptic('success');
    playSound('success');

    // Store the name for reflection
    setCompletedItemName(lastPickedItem.name);

    // Find which category this item belongs to
    const category = categories.find(c =>
      c.items.some(i => i.id === lastPickedItem.id)
    );

    if (category) {
      completeMenuItem(category.id, lastPickedItem.id);
    }

    setShowResult(false);
    setLastPickedItem(null);

    // Show reflection modal after a brief delay
    setTimeout(() => setShowReflection(true), 300);
  };

  const handleDismiss = () => {
    setShowResult(false);
    setLastPickedItem(null);
  };

  const getCategoryForItem = (itemId: string): CategoryType | null => {
    const category = categories.find(c => c.items.some(i => i.id === itemId));
    return category?.id || null;
  };

  const categoryId = lastPickedItem ? getCategoryForItem(lastPickedItem.id) : null;
  const categoryConfig = categoryId ? CATEGORY_CONFIG[categoryId] : null;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="shuffle-button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            {/* Main shuffle button - 3D press effect like Duolingo */}
            <motion.button
              onClick={handleShuffle}
              disabled={isShuffling || allItems.length === 0}
              className={cn(
                'w-full py-5 rounded-2xl font-semibold text-lg relative overflow-hidden',
                'bg-gradient-to-r from-coral via-coral-light to-gold',
                'text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'shadow-[0_6px_0_0_#B54840]',
                'active:shadow-[0_2px_0_0_#B54840] active:translate-y-1',
                'transition-all duration-75'
              )}
              whileHover={!isShuffling ? { scale: 1.02 } : undefined}
              whileTap={!isShuffling ? { y: 4 } : undefined}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'linear',
                }}
              />

              {/* Top highlight for 3D effect */}
              <span className="absolute inset-x-0 top-0 h-[2px] bg-white/30 rounded-t-2xl" />

              {/* Content */}
              <div className="relative flex items-center justify-center gap-3">
                <motion.span
                  animate={isShuffling ? { rotate: 360 } : {}}
                  transition={{ repeat: isShuffling ? Infinity : 0, duration: 0.4, ease: 'linear' }}
                >
                  <Shuffle className="w-6 h-6" />
                </motion.span>

                <span className="min-w-[180px] text-center">
                  {isShuffling ? (
                    <motion.span
                      key={currentShuffleIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="inline-block"
                    >
                      {shuffleTexts[currentShuffleIndex] || 'Shuffling...'}
                    </motion.span>
                  ) : allItems.length === 0 ? (
                    'Add some items first'
                  ) : (
                    "What sounds good?"
                  )}
                </span>
              </div>
            </motion.button>

            {/* Subtle hint */}
            {!isShuffling && allItems.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-cream/30 text-xs mt-2"
              >
                Tap to get a random suggestion
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={controls}
            style={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
              'p-6 rounded-2xl border card-texture relative overflow-hidden',
              'bg-night-light border-cream/10'
            )}
          >
            {/* Subtle animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(244, 201, 93, 0.1), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['-100% 0', '200% 0'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Category badge */}
            {categoryConfig && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-3 relative"
              >
                <motion.span
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {categoryConfig.emoji}
                </motion.span>
                <span className="text-cream/60 text-sm">{categoryConfig.name}</span>
              </motion.div>
            )}

            {/* Item name */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-bold text-cream mb-6 relative"
            >
              {lastPickedItem?.name}
            </motion.h3>

            {/* Actions - using 3D buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3 relative"
            >
              {/* Did it button */}
              <motion.button
                onClick={handleComplete}
                className={cn(
                  'flex-1 py-3 rounded-xl font-medium',
                  'bg-teal text-white',
                  'shadow-[0_4px_0_0_#147A6E]',
                  'active:shadow-[0_1px_0_0_#147A6E] active:translate-y-0.5',
                  'flex items-center justify-center gap-2',
                  'transition-all duration-75'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ y: 3 }}
              >
                <Check className="w-5 h-5" />
                Did it
              </motion.button>

              {/* Another button */}
              <motion.button
                onClick={handleShuffle}
                className={cn(
                  'flex-1 py-3 rounded-xl font-medium',
                  'bg-night border border-cream/20 text-cream',
                  'shadow-[0_4px_0_0_#0F0F1A]',
                  'active:shadow-[0_1px_0_0_#0F0F1A] active:translate-y-0.5',
                  'flex items-center justify-center gap-2',
                  'hover:border-cream/40 transition-all duration-75'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ y: 3 }}
              >
                <RotateCcw className="w-5 h-5" />
                Another
              </motion.button>

              {/* Dismiss */}
              <motion.button
                onClick={handleDismiss}
                className={cn(
                  'py-3 px-4 rounded-xl',
                  'bg-night border border-cream/10 text-cream/60',
                  'hover:text-cream hover:border-cream/20',
                  'transition-colors'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reflection modal after completion */}
      <ReflectionModal
        isOpen={showReflection}
        onClose={() => setShowReflection(false)}
        itemName={completedItemName}
      />
    </div>
  );
}
