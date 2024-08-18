"use client";

import { useEffect, useState } from "react";
import { FaMap } from "react-icons/fa";
import { MdDarkMode, MdHomeFilled, MdLightMode } from "react-icons/md";
import { PiCardsFill } from "react-icons/pi";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarLeftCollapse,
} from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Button } from "@/components/nextui";
import useThemeStore from "@/stores/useThemeStore";
import SidebarContainer from "./sidebar-container";

function Sidebar() {
  const [display, setDisplay] = useState<"static" | "float">("static");
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1496) {
        setDisplay("float");
      } else {
        setDisplay("static");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [theme, toggleTheme] = useThemeStore((state) => [
    state.theme,
    state.toggleTheme,
  ]);

  return (
    <>
      {display === "float" && (
        <div className=" fixed left-2 top-10 z-50">
          <Button
            variant="light"
            className="size-8"
            onClick={() => setDisplay("static")}
            title="展開側邊欄"
          >
            <span className="text-gray-500 dark:text-white">
              <TbLayoutSidebarLeftExpand />
            </span>
          </Button>
        </div>
      )}

      <SidebarContainer display={display}>
        <div className="flex justify-between">
          <Button
            variant="light"
            className="flex w-full items-center justify-start"
            size="sm"
            onClick={() => {
              router.push("/");
            }}
            title="首頁"
          >
            <h1 className="text-md flex items-center font-bold text-gray-400">
              <span className="mr-2  text-lg text-gray-500 dark:text-white">
                <MdHomeFilled className="inline-block" />
              </span>
              首頁
            </h1>
          </Button>
          <Button
            variant="light"
            className="size-6"
            onClick={() =>
              setDisplay(display === "static" ? "float" : "static")
            }
            title="收起側邊欄"
          >
            {display === "static" ? (
              <span className="text-gray-500 dark:text-white">
                <TbLayoutSidebarLeftCollapse />
              </span>
            ) : (
              <span className="text-gray-500 dark:text-white">
                <TbLayoutSidebarLeftExpand />
              </span>
            )}
          </Button>
        </div>
        <Button
          variant="light"
          className="flex w-full justify-start"
          size="sm"
          onClick={() => {
            router.push("/spaces");
          }}
          title="空間庫"
        >
          <h1 className="text-md flex items-center font-bold text-gray-400">
            <span className="mr-2  text-lg text-gray-500 dark:text-white">
              <FaMap className="inline-block" />
            </span>
            空間庫
          </h1>
        </Button>
        <Button
          variant="light"
          className="flex w-full justify-start"
          size="sm"
          onClick={() => {
            router.push("/cards");
          }}
          title="卡片庫"
        >
          <h1 className="text-md flex items-center font-bold text-gray-400">
            <span className="mr-2  text-lg text-gray-500 dark:text-white">
              <PiCardsFill className="inline-block" />
            </span>
            卡片庫
          </h1>
        </Button>
        <Button
          variant="light"
          className="flex w-full justify-start"
          size="sm"
          onClick={toggleTheme}
          title={theme === "dark" ? "切換至淺色模式" : "切換至深色模式"}
        >
          <h1 className="text-md flex items-center font-bold text-gray-400">
            <span className="mr-2  text-lg text-gray-500 dark:text-white">
              {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
            </span>
            {theme === "dark" ? "切換至淺色模式" : "切換至深色模式"}
          </h1>
        </Button>
      </SidebarContainer>
    </>
  );
}

export default Sidebar;
