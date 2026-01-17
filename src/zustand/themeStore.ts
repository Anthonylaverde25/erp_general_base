import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
	mode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			mode: 'light',
			setThemeMode: (mode: ThemeMode) => set({ mode })
		}),
		{
			name: 'theme-storage',
			storage: createJSONStorage(() => localStorage)
		}
	)
);
