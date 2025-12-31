'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'coral' | 'teal' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-medium tracking-wide transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary: 'bg-coral text-white hover:bg-coral-dark shadow-card',
      secondary: 'bg-night-light text-cream border border-cream/10 hover:bg-night-lighter hover:border-cream/20',
      ghost: 'bg-transparent text-cream hover:bg-cream/10',
      coral: 'bg-coral/10 text-coral border border-coral/20 hover:bg-coral/20',
      teal: 'bg-teal/10 text-teal border border-teal/20 hover:bg-teal/20',
      gold: 'bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm rounded-lg',
      md: 'h-11 px-6 text-base rounded-xl',
      lg: 'h-14 px-8 text-lg rounded-xl',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
