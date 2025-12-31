'use client';

// Haptic feedback utility - like Duolingo, strategic not overused

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

const hapticPatterns: Record<HapticType, number[]> = {
  light: [10],
  medium: [20],
  heavy: [30],
  success: [10, 50, 20], // Quick-pause-strong
  warning: [30, 30, 30],
  error: [50, 30, 50],
  selection: [5],
};

export function triggerHaptic(type: HapticType = 'light'): void {
  if (typeof window === 'undefined') return;

  // Check for Vibration API support
  if ('vibrate' in navigator) {
    navigator.vibrate(hapticPatterns[type]);
  }

  // iOS-specific: Web Audio API click sound as fallback
  // This creates a subtle "click" feeling through audio
}

// Hook for easy use in components
export function useHaptic() {
  const haptic = (type: HapticType = 'light') => {
    triggerHaptic(type);
  };

  return { haptic };
}
