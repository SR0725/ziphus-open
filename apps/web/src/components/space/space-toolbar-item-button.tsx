import React from "react";
import { cn } from "@/utils/cn";

const ToolbarItemButton = React.forwardRef(
  (
    {
      isFocused,
      className,
      ...props
    }: React.HTMLAttributes<HTMLButtonElement> & {
      isFocused: boolean;
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "flex h-12 w-12 cursor-pointer flex-col gap-1 items-center justify-center rounded text-gray-500 dark:text-white",
          isFocused ? " bg-gray-200 dark:bg-gray-700" : "bg-opacity-0",
          className
        )}
        {...props}
        ref={ref as React.RefObject<HTMLButtonElement>}
      ></button>
    );
  }
);

export default ToolbarItemButton;
