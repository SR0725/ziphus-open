"use client";

import { useRef, useState } from "react";
import { MdLibraryAdd } from "react-icons/md";
import useCreateCard from "@/hooks/card/useCreateCard";
import useCreateSpaceCard from "@/hooks/space/useCreateSpaceCard";
import { SpaceWithFullData } from "@/hooks/space/useQuerySpaceWithFullData";
import useDraggable from "@/hooks/useDraggable";
import { View } from "@/models/view";
import { cn } from "@/utils/cn";
import transformMouseClientPositionToViewPosition from "@/utils/space/transformMouseClientPositionToViewPosition";
import ToolbarItemButton from "./space-toolbar-item-button";


interface ToolbarItemAddCardButtonProps {
  mutateCreateSpaceCard: ReturnType<typeof useCreateSpaceCard>;
  mutateCreateCard: ReturnType<typeof useCreateCard>;
  space: SpaceWithFullData;
  setSpace: (space: SpaceWithFullData) => void;
  viewRef: React.MutableRefObject<View>;
  editorRef: React.RefObject<HTMLDivElement>;
  setIsPositionLocked: (isLocked: boolean) => void;
  isPositionLocked: boolean;
}

export default function ToolbarItemAddCardButton({
  mutateCreateSpaceCard,
  mutateCreateCard,
  space,
  setSpace,
  viewRef,
  editorRef,
  setIsPositionLocked,
  isPositionLocked,
}: ToolbarItemAddCardButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const draggingShadowRef = useRef<HTMLDivElement>(null);
  const [draggingStartPosition, setDraggingStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [availableAddCard, setAvailableAddCard] = useState(false);
  const [originPositionLocked, setOriginPositionLocked] = useState(false);

  useDraggable({
    draggableItemRef: ref,
    containerRef: editorRef,
    onDragStart({ x, y }) {
      setDraggingStartPosition({ x, y });
      setAvailableAddCard(false);
      setOriginPositionLocked(isPositionLocked);
      setIsPositionLocked(true);
    },
    onDragEnd({ x, y }) {
      if (!draggingStartPosition) return;
      setAvailableAddCard(true);
      setIsPositionLocked(originPositionLocked);
      setDraggingStartPosition(null);
      if (
        Math.abs(x - draggingStartPosition.x) < 32 &&
        Math.abs(y - draggingStartPosition.y) < 32
      ) {
        return;
      }
      mutateCreateCard.mutate(undefined, {
        onSuccess: (data) => {
          const view = viewRef.current;
          mutateCreateSpaceCard.mutate(
            {
              spaceId: space!.id,
              targetCardId: data.data.card.id,
              ...transformMouseClientPositionToViewPosition(view, x, y),
            },
            {
              onSuccess: (data: any) => {
                console.log("新增卡片成功", data.data);
                setSpace({
                  ...space!,
                  spaceCards: [...space!.spaceCards, data.data.spaceCard],
                });
              },
            }
          );
        },
        onError: (error) => {
          console.error("新增卡片失敗", error);
        },
      });
    },
    onDrag({ x, y }) {
      if (!draggingStartPosition) return;
      draggingShadowRef.current!.style.transform = `translate(${x - draggingStartPosition.x}px, ${y - draggingStartPosition.y}px)`;
      if (
        Math.abs(x - draggingStartPosition.x) < 32 &&
        Math.abs(y - draggingStartPosition.y) < 32
      ) {
        draggingShadowRef.current!.style.opacity = "0.2";
        setAvailableAddCard(false);
        return;
      }
      draggingShadowRef.current!.style.opacity = "0.8";
    },
  });

  return (
    <>
      <div className=" relative">
        <ToolbarItemButton ref={ref} isFocused={false}>
          <MdLibraryAdd />
        </ToolbarItemButton>
        <div
          ref={draggingShadowRef}
          className={cn(
            "absolute left-0 top-0 flex h-0 w-0 items-center justify-center rounded bg-gray-800 text-white",
            draggingStartPosition ? "h-12 w-12" : "hidden h-0 w-0"
          )}
        >
          <MdLibraryAdd />
        </div>
        <div
          className=" pointer-events-none absolute right-14 top-0 h-fit w-36 rounded bg-gray-700 px-2 py-1 text-white transition-opacity"
          style={{
            opacity: draggingStartPosition ? 1 : 0,
            transitionDuration:
              !draggingStartPosition && !availableAddCard ? "2s" : "0s",
          }}
        >
          {availableAddCard ? (
            <p>放開新增卡片</p>
          ) : (
            <p className=" text-gray-400">繼續拖曳新增卡片</p>
          )}
        </div>
      </div>
    </>
  );
}