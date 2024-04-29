"use client";

import React, { useEffect, useRef } from "react";
import { View } from "@/models/view";
import transformMouseClientPositionToViewPosition from "@/utils/space/transformMouseClientPositionToViewPosition";


// 滑動移動視圖
const useViewTouch = (
  editorRef: React.RefObject<HTMLDivElement>,
  viewRef: React.MutableRefObject<View>,
  availableMove: boolean = true,
  onChange?: (view: View) => void
) => {
  const lastTouchPosition = useRef({ x: 0, y: 0 });
  const lastTwoPointDeltaDistance = useRef(0);

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) return;

    const onScale = (
      touchCenterX: number,
      touchCenterY: number,
      touchScale: number
    ) => {
      if (!availableMove) return;
      const view = viewRef.current!;

      const newScale = Math.max(0.01, Math.min(2, touchScale));

      // 計算縮放中心點到視圖左上角的距離在縮放前後的變化量
      const { x: centerX, y: centerY } =
        transformMouseClientPositionToViewPosition(
          view,
          touchCenterX,
          touchCenterY
        );
      const { x: newCenterX, y: newCenterY } =
        transformMouseClientPositionToViewPosition(
          {
            x: view.x,
            y: view.y,
            scale: newScale,
          },
          touchCenterX,
          touchCenterY
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
        x: view.x + deltaX,
        y: view.y + deltaY,
        scale: view.scale,
      };
      onChange && onChange(viewRef.current);
    };

    const onSingleTouchStart = (event: TouchEvent) => {
      const touches = event.touches;
      const rect = editor.getBoundingClientRect();
      const touch1x = touches[0]!.clientX - rect.left;
      const touch1y = touches[0]!.clientY - rect.top;

      lastTouchPosition.current.x = touch1x;
      lastTouchPosition.current.y = touch1y;
    };
    const onSingleTouchMove = (event: TouchEvent) => {
      const touches = event.touches;
      const rect = editor.getBoundingClientRect();
      const touch1x = touches[0]!.clientX - rect.left;
      const touch1y = touches[0]!.clientY - rect.top;

      const deltaX = touch1x - lastTouchPosition.current.x;
      const deltaY = touch1y - lastTouchPosition.current.y;

      onMove(deltaX, deltaY);

      lastTouchPosition.current.x = touch1x;
      lastTouchPosition.current.y = touch1y;
    };

    const onDoubleTouchStart = (event: TouchEvent) => {
      const touches = event.touches;
      const rect = editor.getBoundingClientRect();
      const touch1x = touches[0]!.clientX - rect.left;
      const touch1y = touches[0]!.clientY - rect.top;
      const touch2x = touches[1]!.clientX - rect.left;
      const touch2y = touches[1]!.clientY - rect.top;
      event.preventDefault();

      const centerX = (touch1x + touch2x) / 2;
      const centerY = (touch1y + touch2y) / 2;
      lastTouchPosition.current.x = centerX;
      lastTouchPosition.current.y = centerY;
      lastTwoPointDeltaDistance.current = Math.sqrt(
        (touch1x - touch2x) ** 2 + (touch1y - touch2y) ** 2
      );
    };
    const onDoubleTouchMove = (event: TouchEvent) => {
      const touches = event.touches;
      const rect = editor.getBoundingClientRect();
      const touch1x = touches[0]!.clientX - rect.left;
      const touch1y = touches[0]!.clientY - rect.top;
      const touch2x = touches[1]!.clientX - rect.left;
      const touch2y = touches[1]!.clientY - rect.top;

      const centerX = (touch1x + touch2x) / 2;
      const centerY = (touch1y + touch2y) / 2;

      const twoPointDeltaDistance = Math.sqrt(
        (touch1x - touch2x) ** 2 + (touch1y - touch2y) ** 2
      );

      const deltaScale =
        twoPointDeltaDistance - lastTwoPointDeltaDistance.current;

      const { x: viewCenterX, y: viewCenterY } =
        transformMouseClientPositionToViewPosition(
          viewRef.current,
          centerX,
          centerY
        );

      const { x: lastViewCenterX, y: lastViewCenterY } =
        transformMouseClientPositionToViewPosition(
          viewRef.current,
          lastTouchPosition.current.x,
          lastTouchPosition.current.y
        );

      onMove(
        (viewCenterX - lastViewCenterX) * viewRef.current.scale,
        (viewCenterY - lastViewCenterY) * viewRef.current.scale
      );
      onScale(centerX, centerY, viewRef.current.scale + deltaScale * 0.002);

      lastTouchPosition.current.x = centerX;
      lastTouchPosition.current.y = centerY;
      lastTwoPointDeltaDistance.current = twoPointDeltaDistance;
    };

    const onTouchMove = (event: TouchEvent) => {
      const touches = event.touches;

      if (
        touches.length == 1 &&
        ((event.target as HTMLElement)?.classList.contains("card-container") ||
          (event.target as HTMLElement)?.classList.contains("space-card"))
      ) {
        console.log("card-container");
        return;
      }

      if (touches.length == 1) {
        onSingleTouchMove(event);
      } else if (touches.length == 2) {
        onDoubleTouchMove(event);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      const touches = event.touches;

      if (
        touches.length == 1 &&
        (event.target as HTMLElement)?.classList.contains("card-container")
      ) {
        return;
      }

      if (touches.length === 1) {
        onSingleTouchStart(event);
      } else if (touches.length === 2) {
        onDoubleTouchStart(event);
      }
    };

    editor.addEventListener("touchmove", onTouchMove, { passive: false });
    editor.addEventListener("touchstart", onTouchStart, { passive: false });

    return () => {
      editor.removeEventListener("touchmove", onTouchMove);
      editor.removeEventListener("touchstart", onTouchStart);
    };
  }, [availableMove]);
};

export default useViewTouch;