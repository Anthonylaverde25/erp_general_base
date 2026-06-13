import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LanguageState {
	languageId: string;
	setLanguage: (languageId: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
	persist(
		(set) => ({
			languageId: 'es',
			setLanguage: (languageId: string) => set({ languageId })
		}),
		{
			name: 'language-storage',
			storage: createJSONStorage(() => localStorage)
		}
	)
);
