import React, { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore from "@/stores/useEditorStore";

// 右鍵按住拖曳視野
const useViewDragCase = (editorRef: React.RefObject<HTMLDivElement>) => {
  // 初始化所需資料
  const { isViewLocked, set } = useEditorStore(
    useShallow((state) => ({
      isViewLocked: state.isViewLocked,
      set: useEditorStore.setState,
    }))
  );

  const prevXRef = useRef(0);
  const prevYRef = useRef(0);
  const startDraggingViewRef = useRef(false);

  // 右鍵按住拖曳視野
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const onMouseDown = (event: MouseEvent) => {
      if (isViewLocked) return;
      if (event.button !== 2) return;
      prevXRef.current = event.clientX;
      prevYRef.current = event.clientY;
      startDraggingViewRef.current = true;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isViewLocked) return;
      if (!startDraggingViewRef.current) return;

      // 計算滑鼠移動距離
      const view = useEditorStore.getState().view;
      const deltaX = event.clientX - prevXRef.current;
      const deltaY = event.clientY - prevYRef.current;
      prevXRef.current = event.clientX;
      prevYRef.current = event.clientY;

      // 更新視圖的位置
      set({
        view: {
          x: view.x + deltaX,
          y: view.y + deltaY,
          scale: view.scale,
        },
        contextMenuInfo: null,
        isDraggingView: true,
      });

      // 阻止預設事件
      event.preventDefault();
      event.stopPropagation();
    };

    const onMouseUp = (event: MouseEvent) => {
      if (isViewLocked) return;
      if (!startDraggingViewRef.current) return;
      // 結束拖曳視圖
      set({
        isDraggingView: false,
      });
      startDraggingViewRef.current = false;
      // 阻止預設事件
      event.preventDefault();
      event.stopPropagation();
    };

    editor.addEventListener("mousedown", onMouseDown);
    editor.addEventListener("mousemove", onMouseMove);
    editor.addEventListener("mouseup", onMouseUp);

    return () => {
      editor.removeEventListener("mousedown", onMouseDown);
      editor.removeEventListener("mousemove", onMouseMove);
      editor.removeEventListener("mouseup", onMouseUp);
    };
  }, [isViewLocked]);

  return;
};

export default useViewDragCase;
