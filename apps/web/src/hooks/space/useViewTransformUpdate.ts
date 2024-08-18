import React, { useCallback, useEffect, useRef } from "react";
import useEditorStore from "@/stores/useEditorStore";

// 隨時更新視差效果
const useViewTransformUpdate = (
  parallaxBoardRef: React.RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    useEditorStore.subscribe((state) => {
      if (
        state.view.x !== lastViewRef.current.x ||
        state.view.y !== lastViewRef.current.y ||
        state.view.scale !== lastViewRef.current.scale
      ) {
        handleAnimationStart();
      }
    });
    setTimeout(() => {
      handleViewChangeAnimation();
    }, 10);
  }, []);

  const lastViewRef = useRef(useEditorStore.getState().view);
  const animationRef = useRef<number | null>(null);

  const handleAnimationStart = useCallback(() => {
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(() => {
        handleViewChangeAnimation();
        animationRef.current = null;
      });
    }
  }, []);

  const handleViewChangeAnimation = useCallback(() => {
    const view = useEditorStore.getState().view;
    const parallaxBoard = parallaxBoardRef.current;
    if (!parallaxBoard) return;
    parallaxBoard.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
    lastViewRef.current = view;
  }, []);
};

export default useViewTransformUpdate;
