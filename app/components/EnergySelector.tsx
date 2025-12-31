'use client';

import { motion } from 'framer-motion';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, Sparkles } from 'lucide-react';
import { EnergyLevel } from '@/lib/types';
import { useDopamenuStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const energyConfig: {
  level: EnergyLevel | null;
  label: string;
  icon: typeof Battery;
  color: string;
  activeColor: string;
}[] = [
  {
    level: null,
    label: 'All',
    icon: Sparkles,
    color: 'text-cream/60',
    activeColor: 'bg-cream/20 text-cream border-cream',
  },
  {
    level: 'low',
    label: 'Chill',
    icon: BatteryLow,
    color: 'text-teal/60',
    activeColor: 'bg-teal/20 text-teal border-teal',
  },
  {
    level: 'medium',
    label: 'Ready',
    icon: BatteryMedium,
    color: 'text-gold/60',
    activeColor: 'bg-gold/20 text-gold border-gold',
  },
  {
    level: 'high',
    label: 'Energized',
    icon: BatteryFull,
    color: 'text-coral/60',
    activeColor: 'bg-coral/20 text-coral border-coral',
  },
];

export function EnergySelector() {
  const { currentEnergyLevel, setEnergyLevel } = useDopamenuStore();

  return (
    <div className="w-full">
      <p className="text-cream/40 text-sm mb-3 text-center">
        How are you feeling?
      </p>
      <div className="flex gap-2 justify-center">
        {energyConfig.map(({ level, label, icon: Icon, color, activeColor }) => {
          const isActive = currentEnergyLevel === level;

          return (
            <motion.button
              key={label}
              onClick={() => setEnergyLevel(level)}
              className={cn(
                'relative flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl',
                'border transition-all',
                isActive
                  ? activeColor
                  : 'border-cream/10 hover:border-cream/20'
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon className={cn('w-5 h-5', isActive ? '' : color)} />
              <span className={cn(
                'text-xs font-medium',
                isActive ? '' : 'text-cream/60'
              )}>
                {label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="energy-indicator"
                  className="absolute inset-0 rounded-xl border-2 border-current"
                  style={{ borderColor: 'currentColor' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
