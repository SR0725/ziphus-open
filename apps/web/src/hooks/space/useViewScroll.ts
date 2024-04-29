"use client";

import React, { useEffect } from "react";
import { View } from "@/models/view";
import transformMouseClientPositionToViewPosition from "@/utils/space/transformMouseClientPositionToViewPosition";


// 滾動移動視圖
const useViewScroll = (
  editorRef: React.RefObject<HTMLDivElement>,
  viewRef: React.MutableRefObject<View>,
  availableMove: boolean = true,
  onChange?: (view: View) => void
) => {
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const onScale = (event: WheelEvent) => {
      if (!availableMove) return;
      const rect = editor.getBoundingClientRect();
      const view = viewRef.current!;
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
      // 更新視圖的位置和縮放值
      viewRef.current = {
        x: view.x + deltaX,
        y: view.y + deltaY,
        scale: newScale,
      };
      onChange && onChange(viewRef.current);
    };

    const onMove = (deltaX: number, deltaY: number) => {
      if (!availableMove) return;
      const view = viewRef.current!;
      viewRef.current = {
        x: view.x - deltaX,
        y: view.y - deltaY,
        scale: view.scale,
      };
      onChange && onChange(viewRef.current);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      // 觸控板
      if (event.deltaMode === 0) {
        // 放大
        if (event.ctrlKey) {
          onScale(event);
        }
        // 向左向右
        else {
          const deltaValue = event.deltaY || event.deltaX;

          if (event.shiftKey) {
            onMove(deltaValue, 0);
          } else {
            onMove(event.deltaX, event.deltaY);
          }
        }
      }
      // 滑鼠滾輪
      else {
        onScale(event);
      }
    };

    editor.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      editor.removeEventListener("wheel", onWheel);
    };
  }, [availableMove]);
};

export default useViewScroll;