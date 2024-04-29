"use client";

import React, { useEffect, useRef } from "react";
import { ContextMenuInfo } from "@/components/space/space-editor-context-menu";

// 右鍵單點招喚選單
const useViewContextMenu = (
  editorRef: React.RefObject<HTMLDivElement>,
  setContextMenuInfo: (contextMenuInfo: ContextMenuInfo | null) => void,
  contextMenuComponentRef: React.RefObject<HTMLDivElement>
) => {
  const mouseDownPositionRef = useRef<{
    x: number;
    y: number;
  } | null>(null);
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      if (
        mouseDownPositionRef.current &&
        Math.abs(event.clientX - mouseDownPositionRef.current.x) > 3 &&
        Math.abs(event.clientY - mouseDownPositionRef.current.y) > 3
      ) {
        return;
      }

      const editor = editorRef.current;
      if (!editor) return;
      const rect = editor.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const targetSpaceCardId = (event.target as HTMLElement).closest(
        ".space-card"
      )?.id;

      setContextMenuInfo({
        x,
        y,
        targetSpaceCardId,
      });
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 2) {
        mouseDownPositionRef.current = {
          x: event.clientX,
          y: event.clientY,
        };
      }

      // 如果點擊到選單以外的地方，就關閉選單
      if (
        contextMenuComponentRef.current &&
        !contextMenuComponentRef.current.contains(event.target as Node)
      ) {
        setContextMenuInfo(null);
      }
    };

    editor.addEventListener("contextmenu", onContextMenu);
    editor.addEventListener("mousedown", handleMouseDown);

    return () => {
      editor.removeEventListener("contextmenu", onContextMenu);
      editor.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);
};

export default useViewContextMenu;
