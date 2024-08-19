"use client";

import { MdDarkMode, MdLightMode } from "react-icons/md";
import useMe from "@/hooks/useMe";
import useThemeStore from "@/stores/useThemeStore";
import { cn } from "@/utils/cn";

function SpaceListHeader() {
  const { account } = useMe();
  const [theme, toggleTheme] = useThemeStore((state) => [
    state.theme,
    state.toggleTheme,
  ]);

  return (
    <header className="flex w-full items-center justify-between px-8 pt-16">
      <div className="text-black dark:text-white">
        <h3>Welcome back,</h3>
        <h3 className="font-bold">{account?.name ?? "匿名貓貓"} 👋</h3>
      </div>
      <button className={cn("w-8 h-8 rounded-full flex justify-center items-center",
        "text-black dark:text-white border",
      )}>
        {theme === "dark" ? (
          <MdLightMode onClick={toggleTheme} />
        ) : (
          <MdDarkMode onClick={toggleTheme} />
        )}
      </button>
    </header>
  );
}
export default SpaceListHeader;
