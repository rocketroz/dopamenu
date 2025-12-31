'use client';

import { useEffect, useState } from 'react';

// Hook to detect if user prefers reduced motion
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Animation variants that respect reduced motion
export const safeAnimationProps = (prefersReducedMotion: boolean) => ({
  initial: prefersReducedMotion ? false : { opacity: 0, y: 20 },
  animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
  exit: prefersReducedMotion ? {} : { opacity: 0, y: -20 },
  transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.3 },
});

// Simplified spring config for reduced motion
export const safeSpring = (prefersReducedMotion: boolean) =>
  prefersReducedMotion
    ? { type: 'tween', duration: 0.1 }
    : { type: 'spring', stiffness: 400, damping: 25 };

// Hover/tap props that respect reduced motion
export const safeInteractionProps = (prefersReducedMotion: boolean) =>
  prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      };
