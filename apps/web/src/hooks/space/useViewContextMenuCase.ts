"use client";

import React, { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore from "@/stores/useEditorStore";


// 右鍵單點招喚選單
const useViewContextMenuCase = (
  editorRef: React.RefObject<HTMLDivElement>,
  contextMenuComponentRef: React.RefObject<HTMLDivElement>
) => {
  const { isDraggingView, contextMenuInfo, set } = useEditorStore(
    useShallow((state) => ({
      contextMenuInfo: state.contextMenuInfo,
      isDraggingView: state.isDraggingView,
      set: useEditorStore.setState,
    }))
  );
  const lastClickPositionRef = useRef<{
    x: number;
    y: number;
  } | null>(null);
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleContextMenuOpen = (event: MouseEvent) => {
      event.preventDefault();
      // 如果正在拖曳視圖，就不顯示選單
      if (
        lastClickPositionRef.current &&
        (Math.abs(event.clientX - lastClickPositionRef.current.x) > 2 ||
          Math.abs(event.clientY - lastClickPositionRef.current.y) > 2)
      )
        return;

      const editor = editorRef.current;
      if (!editor) return;
      const rect = editor.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const targetSpaceCardId = (event.target as HTMLElement).closest(
        ".space-card"
      )?.id;

      set({
        contextMenuInfo: {
          x,
          y,
          targetSpaceCardId,
        },
      });

      lastClickPositionRef.current = null;
    };

    const handleContextMenuClose = (event: MouseEvent) => {
      lastClickPositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      // 如果點擊到選單以外的地方，就關閉選單
      if (
        contextMenuInfo &&
        event.target !== editorRef.current &&
        !(event.target as Node)?.contains(contextMenuComponentRef.current)
      ) {
        set({
          contextMenuInfo: null,
        });
      }
    };

    editor.addEventListener("contextmenu", handleContextMenuOpen);
    editor.addEventListener("mousedown", handleContextMenuClose, true);

    return () => {
      editor.removeEventListener("contextmenu", handleContextMenuOpen);
      editor.removeEventListener("mousedown", handleContextMenuClose, true);
    };
  }, [isDraggingView, contextMenuInfo]);
};

export default useViewContextMenuCase;