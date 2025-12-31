export type EnergyLevel = 'low' | 'medium' | 'high' | 'any';

export type CategoryType = 'appetizers' | 'sides' | 'entrees' | 'desserts';

export interface MenuItem {
  id: string;
  name: string;
  energy: EnergyLevel;
  createdAt: number;
  completedCount: number;
}

export interface Category {
  id: CategoryType;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  color: 'coral' | 'teal' | 'gold' | 'cream';
  items: MenuItem[];
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface AppState {
  categories: Category[];
  hasCompletedOnboarding: boolean;
  currentEnergyLevel: EnergyLevel | null;
  lastPickedItem: MenuItem | null;
  totalCompletions: number;
}
