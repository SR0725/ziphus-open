"use client";

import { useEffect } from "react";
import { THEME_TYPES } from "@/models/theme-type";
import useThemeStore from "@/stores/useThemeStore";

export const applyThemePreference = (theme: THEME_TYPES) => {
  const { THEME_DARK, THEME_LIGHT } = THEME_TYPES;
  const root = window.document.documentElement;
  const isDark = theme === THEME_DARK;
  root.classList.remove(isDark ? THEME_LIGHT : THEME_DARK);
  root.classList.add(theme);
};

function ThemePreferenceController() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    applyThemePreference(theme);
  }, [theme]);

  return null;
}

export default ThemePreferenceController;
