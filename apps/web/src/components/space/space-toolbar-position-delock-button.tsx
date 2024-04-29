"use client";

import { useState } from "react";
import { MdScreenLockRotation } from "react-icons/md";
import ToolbarItemButton from "./space-toolbar-item-button";

interface ToolbarItemPositionDeLockButtonProps {
  isPositionLocked: boolean;
  setIsPositionLocked: (isLocked: boolean) => void;
}

export default function ToolbarItemPositionDeLockButton({
  isPositionLocked,
  setIsPositionLocked,
}: ToolbarItemPositionDeLockButtonProps) {
  return (
    <>
      <div className=" relative">
        <ToolbarItemButton
          isFocused={true}
          onClick={(event) => {
            event.stopPropagation();
            setIsPositionLocked(!isPositionLocked);
          }}
          className="border border-gray-200"
        >
          <MdScreenLockRotation />
          <span className="text-[10px]">
            解除鎖定
          </span>
        </ToolbarItemButton>
      </div>
    </>
  );
}
