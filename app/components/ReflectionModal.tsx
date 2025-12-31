'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { playSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import { Sparky } from './Sparky';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
}

const reactions = [
  { emoji: '😊', label: 'Great', value: 'great' },
  { emoji: '😌', label: 'Good', value: 'good' },
  { emoji: '😐', label: 'Meh', value: 'meh' },
  { emoji: '😫', label: 'Hard', value: 'hard' },
];

const sparkyResponses: Record<string, string> = {
  great: "That's what I like to hear!",
  good: "Nice work!",
  meh: "Hey, you showed up. That counts.",
  hard: "Proud of you for trying.",
};

export function ReflectionModal({ isOpen, onClose, itemName }: ReflectionModalProps) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showSparkyResponse, setShowSparkyResponse] = useState(false);

  const handleReaction = (value: string) => {
    playSound('tap');
    setSelectedReaction(value);
    setShowSparkyResponse(true);

    // Auto-close after showing response
    setTimeout(() => {
      onClose();
      setSelectedReaction(null);
      setShowSparkyResponse(false);
    }, 1500);
  };

  const handleSkip = () => {
    onClose();
    setSelectedReaction(null);
    setShowSparkyResponse(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-20 z-50 max-w-sm mx-auto"
          >
            <div className="bg-night-light border border-cream/10 rounded-2xl p-6 shadow-card">
              {/* Close button */}
              <motion.button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-cream/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-cream/40" />
              </motion.button>

              {/* Content */}
              <div className="text-center">
                <AnimatePresence mode="wait">
                  {!showSparkyResponse ? (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Sparky */}
                      <div className="flex justify-center mb-4">
                        <Sparky mood="thinking" size="md" />
                      </div>

                      {/* Question */}
                      <h3 className="text-lg font-semibold text-cream mb-2">
                        How did that feel?
                      </h3>
                      <p className="text-cream/50 text-sm mb-6">
                        {itemName}
                      </p>

                      {/* Reaction buttons */}
                      <div className="flex justify-center gap-3">
                        {reactions.map((reaction) => (
                          <motion.button
                            key={reaction.value}
                            onClick={() => handleReaction(reaction.value)}
                            className={cn(
                              'flex flex-col items-center gap-1 p-3 rounded-xl',
                              'bg-night border border-cream/10',
                              'hover:border-cream/20 hover:bg-night-lighter',
                              'transition-colors'
                            )}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="text-2xl">{reaction.emoji}</span>
                            <span className="text-xs text-cream/50">{reaction.label}</span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Skip */}
                      <motion.button
                        onClick={handleSkip}
                        className="mt-4 text-cream/30 text-sm hover:text-cream/50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        Skip
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="response"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-4"
                    >
                      {/* Sparky celebrating */}
                      <div className="flex justify-center mb-4">
                        <Sparky
                          mood={selectedReaction === 'great' || selectedReaction === 'good' ? 'celebrating' : 'idle'}
                          size="lg"
                          showSpeech
                          speech={sparkyResponses[selectedReaction || 'good']}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
