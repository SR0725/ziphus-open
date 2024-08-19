"use client";

import React, { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore from "@/stores/useEditorStore";
import transformMouseClientPositionToViewPosition from "@/utils/space/transformMouseClientPositionToViewPosition";

// 滾動移動視圖
const useViewScrollCase = (editorRef: React.RefObject<HTMLDivElement>) => {
  // 初始化所需資料
  const setEditorState = useEditorStore.setState;
  const wheelEndTimeoutRef = useRef<number | null>(null);

  // 滾動移動或縮放視野
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // 處理放大縮小
    const onScale = (event: WheelEvent) => {
      const isViewLocked = useEditorStore.getState().isViewLocked;
      if (isViewLocked) return;
      // 計算縮放值
      const rect = editor.getBoundingClientRect();
      const view = useEditorStore.getState().view;
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const newScale = Math.max(
        0.01,
        Math.min(2, view.scale - event.deltaY * 0.0003)
      );

      // 計算縮放中心點到視圖左上角的距離在縮放前後的變化量
      const { x: centerX, y: centerY } =
        transformMouseClientPositionToViewPosition(view, mouseX, mouseY);
      const { x: newCenterX, y: newCenterY } =
        transformMouseClientPositionToViewPosition(
          {
            x: view.x,
            y: view.y,
            scale: newScale,
          },
          mouseX,
          mouseY
        );
      const deltaX = (newCenterX - centerX) * newScale;
      const deltaY = (newCenterY - centerY) * newScale;
      // 更新視圖的位置和縮放值，並重置右鍵菜單
      setEditorState({
        view: {
          x: view.x + deltaX,
          y: view.y + deltaY,
          scale: newScale,
        },
        contextMenuInfo: null,
        isDraggingView: true,
      });
    };
    // 處理移動
    const onMove = (deltaX: number, deltaY: number) => {
      const isViewLocked = useEditorStore.getState().isViewLocked;
      if (isViewLocked) return;
      const view = useEditorStore.getState().view;
      // 更新視圖的位置和縮放值，並重置右鍵菜單
      setEditorState({
        contextMenuInfo: null,
        view: {
          x: view.x + deltaX,
          y: view.y + deltaY,
          scale: view.scale,
        },
        isDraggingView: true,
      });
    };

    const handleWheelEnd = () => {
      // 結束拖曳視圖
      setEditorState({ isDraggingView: false });
    };

    const onWheel = (event: WheelEvent) => {
      // 放大
      if (event.ctrlKey) {
        onScale(event);
      }
      // 向左向右
      else {
        const deltaValue = event.deltaY || event.deltaX;

        if (event.shiftKey) {
          onMove(-deltaValue, 0);
        } else {
          onMove(-event.deltaX, -event.deltaY);
        }
      }

      // 如果一段時間沒有滾動，則結束拖曳視圖
      if (wheelEndTimeoutRef.current) {
        clearTimeout(wheelEndTimeoutRef.current);
      }
      wheelEndTimeoutRef.current = window.setTimeout(handleWheelEnd, 100);

      // 阻止預設事件
      event.preventDefault();
      event.stopPropagation();
    };

    editor.addEventListener("wheel", onWheel);

    return () => {
      editor.removeEventListener("wheel", onWheel);
    };
  }, []);
};

export default useViewScrollCase;
