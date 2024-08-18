"use client";

import React, { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore from "@/stores/useEditorStore";
import transformMouseClientPositionToViewPosition from "@/utils/space/transformMouseClientPositionToViewPosition";

// 滑動移動視圖
const useViewTouchCase = (editorRef: React.RefObject<HTMLDivElement>) => {
  // 初始化所需資料
  const { isViewLocked, isDraggingView } = useEditorStore(
    useShallow((state) => ({
      isViewLocked: state.isViewLocked,
      isDraggingView: state.isDraggingView,
    }))
  );

  const setEditorState = useEditorStore.setState;

  const lastTouchPosition = useRef({ x: 0, y: 0 });
  const lastTwoPointDeltaDistance = useRef(0);

  // 單指拖曳視圖，雙指縮放及拖曳視圖
  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) return;

    const onScale = (
      touchCenterX: number,
      touchCenterY: number,
      touchScale: number
    ) => {
      // 計算縮放中心點到視圖左上角的距離在縮放前後的變化量
      if (isViewLocked) return;
      const view = useEditorStore.getState().view;
      const newScale = Math.max(0.01, Math.min(2, touchScale));

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
      setEditorState({
        view: {
          x: view.x - deltaX,
          y: view.y - deltaY,
          scale: newScale,
        },
        isDraggingView: true,
        contextMenuInfo: null,
      });
    };

    const onMove = (deltaX: number, deltaY: number) => {
      if (isViewLocked) return;
      const view = useEditorStore.getState().view;

      // 更新視圖的位置和縮放值
      setEditorState({
        view: {
          x: view.x + deltaX,
          y: view.y + deltaY,
          scale: view.scale,
        },
        isDraggingView: true,
        contextMenuInfo: null,
      });
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

      const view = useEditorStore.getState().view;

      const { x: viewCenterX, y: viewCenterY } =
        transformMouseClientPositionToViewPosition(view, centerX, centerY);

      const { x: lastViewCenterX, y: lastViewCenterY } =
        transformMouseClientPositionToViewPosition(
          view,
          lastTouchPosition.current.x,
          lastTouchPosition.current.y
        );

      onMove(
        (viewCenterX - lastViewCenterX) * view.scale,
        (viewCenterY - lastViewCenterY) * view.scale
      );
      onScale(centerX, centerY, view.scale + deltaScale * 0.002);

      lastTouchPosition.current.x = centerX;
      lastTouchPosition.current.y = centerY;
      lastTwoPointDeltaDistance.current = twoPointDeltaDistance;
    };

    const onTouchStart = (event: TouchEvent) => {
      const touches = event.touches;

      if (touches.length === 1) {
        onSingleTouchStart(event);
      } else if (touches.length === 2) {
        onDoubleTouchStart(event);
      }

      // 阻止預設事件
      event.preventDefault();
      event.stopPropagation();
    };

    const onTouchMove = (event: TouchEvent) => {
      const touches = event.touches;

      if (touches.length == 1) {
        onSingleTouchMove(event);
      } else if (touches.length == 2) {
        onDoubleTouchMove(event);
      }
      // 阻止預設事件
      event.preventDefault();
      event.stopPropagation();
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (isViewLocked) return;
      if (!isDraggingView) return;
      // 結束拖曳視圖
      setEditorState({
        isDraggingView: false,
      });

      // 阻止預設事件
      event.preventDefault();
      event.stopPropagation();
    };

    editor.addEventListener("touchmove", onTouchMove);
    editor.addEventListener("touchstart", onTouchStart);
    editor.addEventListener("touchend", onTouchEnd);

    return () => {
      editor.removeEventListener("touchmove", onTouchMove);
      editor.removeEventListener("touchstart", onTouchStart);
      editor.removeEventListener("touchend", onTouchEnd);
    };
  }, [isViewLocked, isDraggingView]);
};

export default useViewTouchCase;
