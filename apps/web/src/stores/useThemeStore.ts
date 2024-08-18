import { create } from "zustand";
import { persist } from "zustand/middleware";
import { THEME_TYPES } from "@/models/theme-type";

const { THEME_LIGHT, THEME_DARK } = THEME_TYPES;

export interface ThemeState {
  theme: THEME_TYPES;
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: THEME_LIGHT,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT,
        })),
    }),
    {
      name: "bear-storage",
    }
  )
);

export default useThemeStore;
