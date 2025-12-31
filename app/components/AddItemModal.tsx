'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CategoryType, EnergyLevel } from '@/lib/types';
import { useDopamenuStore } from '@/lib/store';
import { ENERGY_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: CategoryType;
  categoryColor: 'coral' | 'teal' | 'gold' | 'cream';
}

const colorStyles = {
  coral: 'bg-coral hover:bg-coral-dark',
  teal: 'bg-teal hover:bg-teal-dark',
  gold: 'bg-gold hover:bg-gold-dark text-night',
  cream: 'bg-cream hover:bg-cream-dark text-night',
};

const energyOptions: EnergyLevel[] = ['low', 'medium', 'high', 'any'];

export function AddItemModal({ isOpen, onClose, categoryId, categoryColor }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [energy, setEnergy] = useState<EnergyLevel>('low');
  const inputRef = useRef<HTMLInputElement>(null);

  const { addMenuItem } = useDopamenuStore();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setEnergy('low');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMenuItem(categoryId, name.trim(), energy);
    onClose();
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 z-50 p-4 safe-bottom"
          >
            <div className="bg-night-light border border-cream/10 rounded-2xl p-6 max-w-lg mx-auto shadow-card">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-cream">Add something good</h3>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-cream/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-cream/60" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name input */}
                <div>
                  <label className="block text-sm text-cream/60 mb-2">
                    What fuels you?
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Dance to one song"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl',
                      'bg-night border border-cream/10',
                      'text-cream placeholder:text-cream/30',
                      'focus:border-cream/30 focus:outline-none transition-colors'
                    )}
                    maxLength={50}
                  />
                </div>

                {/* Energy selector */}
                <div>
                  <label className="block text-sm text-cream/60 mb-3">
                    How much energy does this take?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {energyOptions.map((level) => (
                      <motion.button
                        key={level}
                        type="button"
                        onClick={() => setEnergy(level)}
                        className={cn(
                          'py-2.5 px-3 rounded-xl text-sm font-medium transition-all',
                          'border',
                          energy === level
                            ? level === 'low'
                              ? 'bg-teal/20 border-teal text-teal'
                              : level === 'medium'
                              ? 'bg-gold/20 border-gold text-gold'
                              : level === 'high'
                              ? 'bg-coral/20 border-coral text-coral'
                              : 'bg-cream/20 border-cream text-cream'
                            : 'bg-night border-cream/10 text-cream/60 hover:border-cream/20'
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {ENERGY_LABELS[level]}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={!name.trim()}
                  className={cn(
                    'w-full py-3.5 rounded-xl font-medium transition-all',
                    colorStyles[categoryColor],
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                  whileHover={{ scale: name.trim() ? 1.01 : 1 }}
                  whileTap={{ scale: name.trim() ? 0.99 : 1 }}
                >
                  Add to menu
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
