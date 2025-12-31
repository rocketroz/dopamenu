import { Category, CategoryType, MenuItem } from './types';

export const CATEGORY_CONFIG: Record<CategoryType, Omit<Category, 'items'>> = {
  appetizers: {
    id: 'appetizers',
    name: 'Appetizers',
    tagline: 'Quick hits',
    description: 'Low effort, instant boost. 2-5 min.',
    emoji: '🍿',
    color: 'coral',
  },
  sides: {
    id: 'sides',
    name: 'Sides',
    tagline: 'Background fuel',
    description: 'Pair with other activities.',
    emoji: '🥗',
    color: 'teal',
  },
  entrees: {
    id: 'entrees',
    name: 'Entrees',
    tagline: 'The main event',
    description: 'Requires investment, bigger payoff.',
    emoji: '🍝',
    color: 'gold',
  },
  desserts: {
    id: 'desserts',
    name: 'Desserts',
    tagline: 'Pure indulgence',
    description: 'Save for when you\'ve earned it.',
    emoji: '🍰',
    color: 'cream',
  },
};

export const DEFAULT_MENU_ITEMS: Record<CategoryType, Omit<MenuItem, 'id' | 'createdAt' | 'completedCount'>[]> = {
  appetizers: [
    { name: 'Dance to one song', energy: 'low' },
    { name: 'Step outside, no phone', energy: 'low' },
    { name: 'Text someone you\'re thinking of', energy: 'low' },
    { name: 'Stretch for 3 minutes', energy: 'low' },
  ],
  sides: [
    { name: 'Put on a playlist', energy: 'any' },
    { name: 'Light a candle', energy: 'low' },
    { name: 'Open the windows', energy: 'low' },
    { name: 'Work from a different spot', energy: 'medium' },
  ],
  entrees: [
    { name: 'Deep work session', energy: 'high' },
    { name: 'Cook a real meal', energy: 'medium' },
    { name: 'Long walk, no destination', energy: 'medium' },
    { name: 'Make something with your hands', energy: 'high' },
  ],
  desserts: [
    { name: 'Watch something you love', energy: 'low' },
    { name: 'Guilt-free nap', energy: 'low' },
    { name: 'Order your favorite food', energy: 'low' },
    { name: 'Unplanned adventure', energy: 'high' },
  ],
};

export const ENERGY_LABELS: Record<string, string> = {
  low: 'Chill',
  medium: 'Ready',
  high: 'Energized',
  any: 'Anytime',
};

export const ONBOARDING_SCREENS = [
  {
    title: 'Your energy is a menu',
    body: 'Some days you want a snack. Some days a feast. No judgment, just options.',
  },
  {
    title: 'Pick what fuels you',
    body: 'Appetizers for quick wins. Entrees for deep dives. Desserts for pure joy.',
  },
  {
    title: 'Start with a few favorites',
    body: 'We\'ve added some ideas. Make them yours, or start fresh.',
  },
];

export const CELEBRATION_MESSAGES = [
  'Nice. You did the thing.',
  'Look at you go.',
  'That felt good, right?',
  'One more for the books.',
  'You showed up. That counts.',
  'Checked off. Moving on.',
];

export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export const getGreeting = (): string => {
  const time = getTimeOfDay();
  const greetings = {
    morning: ['Good morning', 'Rise and shine', 'Morning'],
    afternoon: ['Good afternoon', 'Hey there', 'Afternoon'],
    evening: ['Good evening', 'Evening', 'Winding down?'],
  };
  const options = greetings[time];
  return options[Math.floor(Math.random() * options.length)];
};
