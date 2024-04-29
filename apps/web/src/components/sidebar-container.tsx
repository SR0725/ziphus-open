"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface SidebarContainerProps {
  display: "static" | "float";
  className?: string;
  children: React.ReactNode;
}
function SidebarContainer({
  display,
  className,
  children,
}: SidebarContainerProps) {
  const [showFloatingContainer, setShowFloatingContainer] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (showFloatingContainer) {
        if (e.clientX > containerRef.current?.offsetWidth! + 20) {
          setShowFloatingContainer(false);
        }
      } else {
        if (e.clientX < 20) {
          setShowFloatingContainer(true);
        }
      }
    }

    if (display === "float") {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [display, showFloatingContainer]);

  return (
    <div
      className={cn(
        "z-10 w-64 border-r-2 border-solid border-[#262626] bg-[#202020] p-2",
        display === "float" &&
          "fixed top-[50vh] h-fit min-h-[600px] -translate-y-1/2 rounded-lg transition-all duration-300",
        className
      )}
      style={{
        left: showFloatingContainer ? "20px" : "-100%",
      }}
      ref={containerRef}
    >
      {children}
    </div>
  );
}

export default SidebarContainer;
