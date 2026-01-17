import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FontSizeState {
    fontSize: number;
    setFontSize: (size: number) => void;
    applyFontSize: () => void;
}

export const useFontSizeStore = create<FontSizeState>()(
    persist(
        (set, get) => ({
            fontSize: 16,
            setFontSize: (size: number) => {
                set({ fontSize: size });
                get().applyFontSize();
            },
            applyFontSize: () => {
                const { fontSize } = get();
                const html = document.getElementsByTagName('html')[0];
                if (html) {
                    html.style.fontSize = `${fontSize}px`;
                }
            }
        }),
        {
            name: 'font-size-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);
