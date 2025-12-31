'use client';

import { forwardRef, ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { triggerHaptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';

interface PressableButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'coral' | 'teal' | 'gold' | 'cream' | 'night';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const variants = {
  coral: {
    base: 'bg-coral',
    shadow: 'shadow-[0_6px_0_0_#B54840]',
    pressed: 'shadow-[0_2px_0_0_#B54840]',
    glow: 'shadow-glow-coral',
  },
  teal: {
    base: 'bg-teal',
    shadow: 'shadow-[0_6px_0_0_#147A6E]',
    pressed: 'shadow-[0_2px_0_0_#147A6E]',
    glow: 'shadow-glow-teal',
  },
  gold: {
    base: 'bg-gold text-night',
    shadow: 'shadow-[0_6px_0_0_#C9A34B]',
    pressed: 'shadow-[0_2px_0_0_#C9A34B]',
    glow: 'shadow-glow-gold',
  },
  cream: {
    base: 'bg-cream text-night',
    shadow: 'shadow-[0_6px_0_0_#B8B8B8]',
    pressed: 'shadow-[0_2px_0_0_#B8B8B8]',
    glow: '',
  },
  night: {
    base: 'bg-night-light border border-cream/10',
    shadow: 'shadow-[0_4px_0_0_#1A1A2E]',
    pressed: 'shadow-[0_1px_0_0_#1A1A2E]',
    glow: '',
  },
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl font-semibold',
};

export const PressableButton = forwardRef<HTMLButtonElement, PressableButtonProps>(
  ({ children, onClick, className, disabled, variant = 'coral', size = 'md', glow }, ref) => {
    const controls = useAnimation();
    const style = variants[variant];

    const handlePress = async () => {
      if (disabled) return;

      // Haptic feedback - this is strategic, not every button
      triggerHaptic('light');

      // Animate press
      await controls.start({
        y: 4,
        transition: { duration: 0.1 },
      });
    };

    const handleRelease = async () => {
      if (disabled) return;

      // Animate release with slight overshoot
      await controls.start({
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 15
        },
      });

      onClick?.();
    };

    return (
      <motion.button
        ref={ref}
        animate={controls}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={() => controls.start({ y: 0 })}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        disabled={disabled}
        className={cn(
          'relative font-medium text-white transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:outline-none focus:outline-none',
          style.base,
          style.shadow,
          sizes[size],
          glow && style.glow,
          className
        )}
        style={{
          // 3D effect base
          transformStyle: 'preserve-3d',
        }}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
      >
        {/* Top highlight for 3D effect */}
        <span className="absolute inset-x-0 top-0 h-[2px] bg-white/20 rounded-t-xl" />

        {children}
      </motion.button>
    );
  }
);

PressableButton.displayName = 'PressableButton';
