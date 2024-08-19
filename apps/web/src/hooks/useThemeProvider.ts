import { useState } from "react";
import useThemeStore from "@/stores/useThemeStore";

/**
 * 取得深色淺色主題
 * 資料儲存在 localStorage 中，key 為 theme
 */
function useThemeProvider() {
  const [theme, toggleTheme] = useThemeStore((state) => [
    state.theme,
    state.toggleTheme,
  ]);

  return {
    theme,
    toggleTheme,
  };
}

export default useThemeProvider;
