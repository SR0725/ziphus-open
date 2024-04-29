import React, { useEffect, useRef } from "react";
import { View } from "@/models/view";

// 隨時更新視差效果
const useViewTransformUpdate = (
  parallaxBoardRef: React.RefObject<HTMLDivElement>,
  viewRef: React.MutableRefObject<View>
) => {
  const lastViewRef = useRef<View>({
    x: 0,
    y: 0,
    scale: 1,
  });
  useEffect(() => {
    let animationFrameId = 0;
    function handleViewChange() {
      animationFrameId = requestAnimationFrame(handleViewChange);
      const parallaxBoard = parallaxBoardRef.current;
      if (!parallaxBoard) return;
      if (
        lastViewRef.current.x === viewRef.current.x &&
        lastViewRef.current.y === viewRef.current.y &&
        lastViewRef.current.scale === viewRef.current.scale
      ) {
        return;
      }

      parallaxBoard.style.transform = `translate(${viewRef.current.x}px, ${viewRef.current.y}px) scale(${viewRef.current.scale})`;
      lastViewRef.current = { ...viewRef.current };
    }
    handleViewChange();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
};

export default useViewTransformUpdate;
