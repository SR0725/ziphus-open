"use client";

import { useEffect, useRef, useState } from "react";
import { SpaceCardDTO } from "@repo/shared-types";
import useUpdateSpaceCardPosition from "@/hooks/space/useUpdateSpaceCardPosition";
import useDraggable from "@/hooks/useDraggable";
import { View } from "@/models/view";
import { cn } from "@/utils/cn";

// 隨時更新位置
const useTransformUpdate = (
  spaceCardHTMLElementRef: React.RefObject<HTMLDivElement>,
  spaceCardDataRef: React.MutableRefObject<SpaceCardDTO>
) => {
  const lastPositionRef = useRef<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    let animationFrameId = 0;
    function handleViewChange() {
      animationFrameId = requestAnimationFrame(handleViewChange);
      const spaceCardElement = spaceCardHTMLElementRef.current;
      if (!spaceCardElement) return;
      if (
        lastPositionRef.current.x === spaceCardDataRef.current.x &&
        lastPositionRef.current.y === spaceCardDataRef.current.y
      ) {
        return;
      }

      spaceCardElement.style.transform = `translateX(${spaceCardDataRef.current.x}px) translateY(${spaceCardDataRef.current.y}px)`
      lastPositionRef.current = { ...spaceCardDataRef.current };
    }
    handleViewChange();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
};

interface SpaceCardEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  initialSpaceCard: SpaceCardDTO;
  isFocus: boolean;
  viewRef: React.MutableRefObject<View>;
  layers: string[];
}

function SpaceCardEditor({
  initialSpaceCard,
  isFocus,
  viewRef,
  children,
  layers,
  style,
  className,
  ...props
}: SpaceCardEditorProps) {
  const spaceCardHTMLElementRef = useRef<HTMLDivElement>(null);
  const spaceCardDataRef = useRef<SpaceCardDTO>(initialSpaceCard);
  const [currentLayerIndex, setCurrentLayerIndex] = useState<number>(0);
  useEffect(() => {
    const layerIndex = layers.findIndex(
      (layer) => layer === initialSpaceCard.id
    );
    setCurrentLayerIndex(layerIndex);
  }, [layers, initialSpaceCard.id]);

  useTransformUpdate(spaceCardHTMLElementRef, spaceCardDataRef);

  const { handleUpdatePosition } = useUpdateSpaceCardPosition(spaceCardDataRef);

  useDraggable({
    available: !isFocus,
    draggableItemRef: spaceCardHTMLElementRef,
    onDrag: ({ deltaX, deltaY, event }) => {
      if (isFocus) return;
      spaceCardDataRef.current = {
        ...spaceCardDataRef.current,
        x: spaceCardDataRef.current.x + deltaX / viewRef.current.scale,
        y: spaceCardDataRef.current.y + deltaY / viewRef.current.scale,
      };
      handleUpdatePosition({
        spaceId: spaceCardDataRef.current.targetSpaceId,
        spaceCardId: spaceCardDataRef.current.id,
        x: spaceCardDataRef.current.x,
        y: spaceCardDataRef.current.y,
      });
    },
  });

  return (
    <div
      className={cn(
        "space-card absolute h-fit w-fit rounded-lg bg-dark-card-bg shadow-md",
        isFocus
          ? "outline outline-4 outline-white "
          : "cursor-pointer outline outline-1 outline-white ",
        className
      )}
      style={{
        ...style,
        zIndex: currentLayerIndex,
      }}
      {...props}
      ref={spaceCardHTMLElementRef}
      id={initialSpaceCard.id}
    >
      {children}
    </div>
  );
}

export default SpaceCardEditor;
