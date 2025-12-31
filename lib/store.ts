'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, CategoryType, EnergyLevel, MenuItem } from './types';
import { CATEGORY_CONFIG, DEFAULT_MENU_ITEMS } from './constants';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getToday = () => new Date().toISOString().split('T')[0];

const createDefaultCategories = (): Category[] => {
  return (Object.keys(CATEGORY_CONFIG) as CategoryType[]).map((categoryId) => ({
    ...CATEGORY_CONFIG[categoryId],
    items: DEFAULT_MENU_ITEMS[categoryId].map((item) => ({
      ...item,
      id: generateId(),
      createdAt: Date.now(),
      completedCount: 0,
    })),
  }));
};

interface DopamenuStore {
  // State
  categories: Category[];
  hasCompletedOnboarding: boolean;
  currentEnergyLevel: EnergyLevel | null;
  lastPickedItem: MenuItem | null;
  showCelebration: boolean;
  totalCompletions: number;

  // Streak tracking (like Duolingo!)
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;

  // Actions
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setEnergyLevel: (level: EnergyLevel | null) => void;

  // Menu item actions
  addMenuItem: (categoryId: CategoryType, name: string, energy: EnergyLevel) => void;
  updateMenuItem: (categoryId: CategoryType, itemId: string, updates: Partial<Pick<MenuItem, 'name' | 'energy'>>) => void;
  deleteMenuItem: (categoryId: CategoryType, itemId: string) => void;
  completeMenuItem: (categoryId: CategoryType, itemId: string) => void;

  // Quick pick
  getRandomItem: (categoryId?: CategoryType) => MenuItem | null;
  setLastPickedItem: (item: MenuItem | null) => void;

  // Celebration
  triggerCelebration: () => void;
  dismissCelebration: () => void;

  // Streak
  updateStreak: () => void;

  // Utility
  getCategory: (categoryId: CategoryType) => Category | undefined;
  getFilteredItems: (categoryId: CategoryType) => MenuItem[];
  resetToDefaults: () => void;
}

export const useDopamenuStore = create<DopamenuStore>()(
  persist(
    (set, get) => ({
      // Initial state
      categories: createDefaultCategories(),
      hasCompletedOnboarding: false,
      currentEnergyLevel: null,
      lastPickedItem: null,
      showCelebration: false,
      totalCompletions: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,

      // Onboarding
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
        get().updateStreak();
      },
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),

      // Energy level
      setEnergyLevel: (level) => set({ currentEnergyLevel: level }),

      // Menu item management
      addMenuItem: (categoryId, name, energy) => {
        const newItem: MenuItem = {
          id: generateId(),
          name,
          energy,
          createdAt: Date.now(),
          completedCount: 0,
        };

        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === categoryId
              ? { ...cat, items: [...cat.items, newItem] }
              : cat
          ),
        }));
      },

      updateMenuItem: (categoryId, itemId, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  items: cat.items.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                }
              : cat
          ),
        }));
      },

      deleteMenuItem: (categoryId, itemId) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === categoryId
              ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
              : cat
          ),
        }));
      },

      completeMenuItem: (categoryId, itemId) => {
        // Update streak first
        get().updateStreak();

        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  items: cat.items.map((item) =>
                    item.id === itemId
                      ? { ...item, completedCount: item.completedCount + 1 }
                      : item
                  ),
                }
              : cat
          ),
          totalCompletions: state.totalCompletions + 1,
          showCelebration: true,
        }));
      },

      // Quick pick
      getRandomItem: (categoryId) => {
        const { categories, currentEnergyLevel } = get();

        let availableItems: MenuItem[] = [];

        if (categoryId) {
          const category = categories.find((c) => c.id === categoryId);
          availableItems = category?.items || [];
        } else {
          availableItems = categories.flatMap((c) => c.items);
        }

        // Filter by energy level if set
        if (currentEnergyLevel && currentEnergyLevel !== 'any') {
          availableItems = availableItems.filter(
            (item) => item.energy === currentEnergyLevel || item.energy === 'any'
          );
        }

        if (availableItems.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * availableItems.length);
        return availableItems[randomIndex];
      },

      setLastPickedItem: (item) => set({ lastPickedItem: item }),

      // Celebration
      triggerCelebration: () => set({ showCelebration: true }),
      dismissCelebration: () => set({ showCelebration: false }),

      // Streak management
      updateStreak: () => {
        const today = getToday();
        const { lastActiveDate, currentStreak, longestStreak } = get();

        if (lastActiveDate === today) {
          // Already active today, no update needed
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = currentStreak;

        if (lastActiveDate === yesterdayStr) {
          // Consecutive day, increment streak
          newStreak = currentStreak + 1;
        } else if (!lastActiveDate) {
          // First time using app
          newStreak = 1;
        } else {
          // Streak broken, start fresh
          newStreak = 1;
        }

        set({
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, longestStreak),
          lastActiveDate: today,
        });
      },

      // Utility
      getCategory: (categoryId) => {
        return get().categories.find((c) => c.id === categoryId);
      },

      getFilteredItems: (categoryId) => {
        const { categories, currentEnergyLevel } = get();
        const category = categories.find((c) => c.id === categoryId);
        if (!category) return [];

        if (!currentEnergyLevel || currentEnergyLevel === 'any') {
          return category.items;
        }

        return category.items.filter(
          (item) => item.energy === currentEnergyLevel || item.energy === 'any'
        );
      },

      resetToDefaults: () => {
        set({
          categories: createDefaultCategories(),
          hasCompletedOnboarding: false,
          currentEnergyLevel: null,
          lastPickedItem: null,
          showCelebration: false,
          totalCompletions: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null,
        });
      },
    }),
    {
      name: 'dopamenu-storage',
      version: 2,
    }
  )
);
