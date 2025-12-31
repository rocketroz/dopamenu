'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';

export function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isSoundEnabled());
  }, []);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    setSoundEnabled(newValue);

    // Play a tap sound if enabling
    if (newValue) {
      playSound('tap');
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      className={cn(
        'p-2 rounded-lg transition-colors',
        enabled
          ? 'text-cream/60 hover:text-cream hover:bg-cream/10'
          : 'text-cream/30 hover:text-cream/50 hover:bg-cream/5'
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={enabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {enabled ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </motion.button>
  );
}
