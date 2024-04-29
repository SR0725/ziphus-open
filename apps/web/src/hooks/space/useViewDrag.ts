import React, { useEffect, useRef } from "react";
import { View } from "@/models/view";


// 右鍵按住拖曳視野
const useViewDrag = (
  editorRef: React.RefObject<HTMLDivElement>,
  viewRef: React.MutableRefObject<View>,
  availableMove: boolean = true,
  onChange?: (view: View) => void
) => {
  const prevXRef = useRef(0);
  const prevYRef = useRef(0);
  const isDraggingRef = useRef(false);
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const onMouseDown = (event: MouseEvent) => {
      if (!availableMove) return;
      if (event.button === 2) {
        isDraggingRef.current = true;
        prevXRef.current = event.clientX;
        prevYRef.current = event.clientY;
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!availableMove) return;

      if (isDraggingRef.current) {
        const view = viewRef.current!;
        const deltaX = event.clientX - prevXRef.current;
        const deltaY = event.clientY - prevYRef.current;
        prevXRef.current = event.clientX;
        prevYRef.current = event.clientY;
        viewRef.current = {
          x: view.x + deltaX,
          y: view.y + deltaY,
          scale: view.scale,
        };
        onChange && onChange(viewRef.current);
      }
    };

    const onMouseUp = () => {
      if (!availableMove) return;
      isDraggingRef.current = false;
    };

    editor.addEventListener("mousedown", onMouseDown);
    editor.addEventListener("mousemove", onMouseMove);
    editor.addEventListener("mouseup", onMouseUp);

    return () => {
      editor.removeEventListener("mousedown", onMouseDown);
      editor.removeEventListener("mousemove", onMouseMove);
      editor.removeEventListener("mouseup", onMouseUp);
    };
  }, [availableMove]);

  return isDraggingRef;
};

export default useViewDrag;