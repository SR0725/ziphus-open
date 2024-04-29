import { useEffect, useRef } from "react";
import { CardDto } from "@repo/shared-types";

export const MIN_DRAG_CARD_HEIGHT = 100;
export const MIN_DRAG_CARD_WIDTH = 100;

// 拉動卡片邊框
type ResizeBorderType = "width" | "height" | "all";
const useCardResize = (
  available: boolean,
  cardRef: React.MutableRefObject<CardDto | undefined>,
  onResizeMove: (width: number, height: number) => void,
  onResizeFinish: (width: number, height: number) => void
) => {
  const initialCard = useRef(cardRef.current);
  const initialPosition = useRef({
    x: 0,
    y: 0,
  });
  const widthBorderHandleRef = useRef<HTMLDivElement>(null);
  const heightBorderHandleRef = useRef<HTMLDivElement>(null);
  const cornerBorderHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const widthBorderHandle = widthBorderHandleRef.current;
    const heightBorderHandle = heightBorderHandleRef.current;
    if (!available || !widthBorderHandle || !heightBorderHandle) return;

    const getResize = (event: MouseEvent | TouchEvent) => {
      const clientX =
        ("clientX" in event ? event.clientX : event.touches[0]?.clientX) ?? 0;
      const clientY =
        ("clientY" in event ? event.clientY : event.touches[0]?.clientY) ?? 0;

      const ratio =
        heightBorderHandle.getBoundingClientRect().width /
        heightBorderHandle.clientWidth;

      const deltaWidth = (clientX - initialPosition.current.x) / ratio;
      const deltaHeight = (clientY - initialPosition.current.y) / ratio;
      const width = Math.max(
        MIN_DRAG_CARD_WIDTH,
        cardRef.current!.width + deltaWidth
      );
      const height = Math.max(
        MIN_DRAG_CARD_HEIGHT,
        cardRef.current!.height + deltaHeight
      );
      initialPosition.current = {
        x: clientX,
        y: clientY,
      };
      return {
        width,
        height,
      };
    };

    const handleResizeMove =
      (type: ResizeBorderType) => (event: MouseEvent | TouchEvent) => {
        const { width, height } = getResize(event);
        onResizeMove(
          type === "height" ? initialCard.current!.width : width,
          type === "width" ? initialCard.current!.height : height
        );
      };

    const handleResizeFinish =
      (type: ResizeBorderType) => (event: MouseEvent | TouchEvent) => {
        const { width, height } = getResize(event);
        onResizeFinish(
          type === "height" ? initialCard.current!.width : width,
          type === "width" ? initialCard.current!.height : height
        );
      };

    const handleResizeMoveMap = {
      width: handleResizeMove("width"),
      height: handleResizeMove("height"),
      all: handleResizeMove("all"),
    };

    const handleResizeFinishMap = {
      width: handleResizeFinish("width"),
      height: handleResizeFinish("height"),
      all: handleResizeFinish("all"),
    };

    const handlePointUp = (type: ResizeBorderType) => () => {
      document.removeEventListener("mousemove", handleResizeMoveMap[type]);
      document.removeEventListener("mouseup", handleResizeFinishMap[type]);
      document.removeEventListener("mouseup", handlePointUpMap[type]);
      document.removeEventListener("touchmove", handleResizeMoveMap[type]);
      document.removeEventListener("touchend", handleResizeFinishMap[type]);
      document.removeEventListener("touchend", handlePointUpMap[type]);
    };

    const handlePointUpMap = {
      width: handlePointUp("width"),
      height: handlePointUp("height"),
      all: handlePointUp("all"),
    };

    const handlePointDown =
      (type: ResizeBorderType) => (event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        document.addEventListener("mousemove", handleResizeMoveMap[type]);
        document.addEventListener("mouseup", handleResizeFinishMap[type]);
        document.addEventListener("mouseup", handlePointUpMap[type]);
        document.addEventListener("touchmove", handleResizeMoveMap[type]);
        document.addEventListener("touchend", handleResizeFinishMap[type]);
        document.addEventListener("touchend", handlePointUpMap[type]);
        initialCard.current = {
          ...cardRef.current,
        } as CardDto;
        const clientX =
          ("clientX" in event ? event.clientX : event.touches[0]?.clientX) ?? 0;
        const clientY =
          ("clientY" in event ? event.clientY : event.touches[0]?.clientY) ?? 0;
        initialPosition.current = {
          x: clientX,
          y: clientY,
        };
      };

    const handlePointDownMap = {
      width: handlePointDown("width"),
      height: handlePointDown("height"),
      all: handlePointDown("all"),
    };

    widthBorderHandle.addEventListener("mousedown", handlePointDownMap.width);
    heightBorderHandle.addEventListener("mousedown", handlePointDownMap.height);
    cornerBorderHandleRef.current?.addEventListener(
      "mousedown",
      handlePointDownMap.all
    );
    widthBorderHandle.addEventListener("touchstart", handlePointDownMap.width);
    heightBorderHandle.addEventListener(
      "touchstart",
      handlePointDownMap.height
    );
    cornerBorderHandleRef.current?.addEventListener(
      "touchstart",
      handlePointDownMap.all
    );

    return () => {
      widthBorderHandle.removeEventListener(
        "mousedown",
        handlePointDownMap.width
      );
      heightBorderHandle.removeEventListener(
        "mousedown",
        handlePointDownMap.height
      );
      cornerBorderHandleRef.current?.removeEventListener(
        "mousedown",
        handlePointDownMap.all
      );
      widthBorderHandle.removeEventListener(
        "touchstart",
        handlePointDownMap.width
      );
      heightBorderHandle.removeEventListener(
        "touchstart",
        handlePointDownMap.height
      );
      cornerBorderHandleRef.current?.removeEventListener(
        "touchstart",
        handlePointDownMap.all
      );
    };
  }, [available, onResizeMove, onResizeFinish]);

  return {
    widthBorderHandleRef,
    heightBorderHandleRef,
    cornerBorderHandleRef,
  };
};

export default useCardResize;
