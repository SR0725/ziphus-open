"use client";

import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { SpaceCardDTO } from "@repo/shared-types";
import useGetSpaceCard from "@/hooks/space/useGetSpaceCard";
import useSpaceCardDragCase from "@/hooks/space/useSpaceCardDragCase";
import useSpaceCardFocusCase from "@/hooks/space/useSpaceCardFocusCase";
import useSpaceCardTransformUpdate from "@/hooks/space/useSpaceCardTransformUpdate";
import useUpdateSpaceCardPositionCase from "@/hooks/space/useUpdateSpaceCardPositionCase";
import useDraggable from "@/hooks/useDraggable";
import useEditorStore from "@/stores/useEditorStore";
import useSpaceStore from "@/stores/useSpaceStore";
import { cn } from "@/utils/cn";
import SpaceCardEditorLinkManager from "./space-card-editor-link";

interface SpaceCardEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  spaceCardId: string;
}

function SpaceCardEditor({
  spaceCardId,
  children,
  style,
  className,
  ...props
}: SpaceCardEditorProps) {
  const [currentLayerIndex, setCurrentLayerIndex] = useState(-1);
  const getSpaceCard = useGetSpaceCard();
  const { layers } = useSpaceStore(
    useShallow((state) => ({
      layers: state.layers,
    }))
  );
  useEffect(() => {
    const spaceCard = getSpaceCard(spaceCardId);
    if (!spaceCard) return;
    const layerIndex = layers.findIndex((l) => l === spaceCard.id);
    if (layerIndex < 0) return;
    setCurrentLayerIndex(layerIndex);
  }, [spaceCardId, layers]);

  const isFocus = useEditorStore(
    (state) => state.focusSpaceCardId === spaceCardId
  );

  const spaceCardHTMLElementRef = useRef<HTMLDivElement>(null);
  const handleUpdatePosition = useUpdateSpaceCardPositionCase(spaceCardId);
  const { handleDragCard, handleEndDragAllCard } = useSpaceCardDragCase();
  const { handleFocusCard } = useSpaceCardFocusCase();

  useDraggable({
    available: !isFocus,
    draggableItemRef: spaceCardHTMLElementRef,
    onDrag: ({ deltaX, deltaY }) => {
      if (isFocus) return;
      const view = useEditorStore.getState().view;
      const spaceCard = useSpaceStore
        .getState()
        .spaceCards.find((sc) => sc.id === spaceCardId)!;

      handleDragCard(spaceCardId);
      handleUpdatePosition({
        spaceId: spaceCard.targetSpaceId,
        spaceCardId: spaceCardId,
        x: spaceCard.x + deltaX / view.scale,
        y: spaceCard.y + deltaY / view.scale,
      });
    },
    onDragEnd: () => {
      handleEndDragAllCard();
    },
  });

  useSpaceCardTransformUpdate(spaceCardHTMLElementRef, spaceCardId);

  return (
    <>
      <div
        className={cn(
          "space-card bg-white-card-bg absolute h-fit w-fit rounded-lg shadow-sm dark:shadow-md dark:bg-dark-card-bg",
          isFocus
            ? "outline outline-4 dark:outline-white outline-gray-400"
            : "cursor-pointer outline outline-1 dark:outline-white outline-gray-400",
          className
        )}
        style={{
          ...style,
          zIndex: currentLayerIndex,
        }}
        {...props}
        ref={spaceCardHTMLElementRef}
        onClick={(event) => {
          const draggingSpaceCardList =
            useEditorStore.getState().draggingSpaceCardList;
          if (
            draggingSpaceCardList &&
            draggingSpaceCardList.includes(spaceCardId)
          )
            return;
          // 聚焦卡片
          handleFocusCard(spaceCardId);
          // 阻止預設事件
          event.preventDefault();
          event.stopPropagation();
        }}
        id={spaceCardId}
      >
        {children}
        {/** link dot */}
        <SpaceCardEditorLinkManager spaceCardId={spaceCardId} />
      </div>
    </>
  );
}

export default SpaceCardEditor;
