"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { filterMarkdownPunctuation } from "@repo/shared-utils";
import useGetCard from "@/hooks/card/useGetCard";
import useGetSpaceCard from "@/hooks/space/useGetSpaceCard";
import useMobileFocusSpaceCard from "@/hooks/space/useMobileFocusSpaceCard";
import useMobileIsEditing from "@/hooks/space/useMobileIsEditing";
import useMobileViewStore from "@/stores/useMobileViewStore";
import { cn } from "@/utils/cn";

function MobileSpaceEditorPageNavigator({
  isScrollByNavigator,
  setIsScrollByNavigator,
}: {
  isScrollByNavigator: boolean;
  setIsScrollByNavigator: (isScrollByNavigator: boolean) => void;
}) {
  //*  目前聚焦的卡片
  const { focusSpaceCard, goTargetSpaceCard } = useMobileFocusSpaceCard();
  const noteCardOrder = useMobileViewStore((state) => state.noteCardOrder);
  const spaceCardIndex = useMemo(
    () =>
      noteCardOrder.findIndex(
        (noteCardId) => noteCardId === focusSpaceCard?.id
      ),
    [focusSpaceCard?.id, noteCardOrder]
  );
  const [targetIndex, setTargetIndex] = useState(0);

  useEffect(() => {
    if (targetIndex !== spaceCardIndex) {
      setTargetIndex(spaceCardIndex);
    }
  }, [spaceCardIndex]);

  const startTouchX = useRef(0);
  const progress = Math.round((targetIndex / noteCardOrder.length) * 5);
  const { isEditing } = useMobileIsEditing();
  const getSpaceCard = useGetSpaceCard();
  const getCard = useGetCard();

  const displayLayers =
    targetIndex < 6
      ? noteCardOrder.slice(0, 12)
      : noteCardOrder.length < 12
        ? noteCardOrder
        : noteCardOrder.slice(targetIndex - 6, targetIndex + 6);

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-10 h-screen w-screen bg-[#d9d9d9] transition-all duration-300",
          isScrollByNavigator ? " bg-opacity-100" : " bg-opacity-0 opacity-0"
        )}
      >
        <div
          className={cn(
            "flex h-full w-full flex-col items-start justify-start pt-8"
          )}
        >
          <h1 className="px-4 py-2 text-4xl">目錄</h1>
          {displayLayers.map((spaceCardId, index) => {
            const spaceCard = getSpaceCard(spaceCardId);
            if (!spaceCard) return null;
            const card = getCard(spaceCard.targetCardId);
            if (!card) return null;
            const layerIndex = noteCardOrder.findIndex(
              (noteCardId) => noteCardId === spaceCardId
            );
            return (
              <h1
                className={cn(
                  " h-12 w-fit max-w-full truncate border-b border-solid border-[#252925] px-4 py-2 transition-all duration-300",
                  layerIndex === targetIndex
                    ? "font-bold text-[#252925]"
                    : "text-[#252925] "
                )}
                key={spaceCard.id}
              >
                <span className=" text-2xl">{layerIndex + 1}.</span>
                <span
                  className={cn(
                    " text-lg transition-all duration-300",
                    layerIndex === targetIndex ? "pl-4" : "pl-0"
                  )}
                >
                  {filterMarkdownPunctuation(card.title)}
                </span>
              </h1>
            );
          })}
        </div>

        <div
          className={cn(
            "fixed bottom-36 left-1/2 z-20 w-fit -translate-x-1/2 rounded-full bg-[#b3b2b2] px-4 py-1 text-white transition-all duration-300"
          )}
        >
          左右滑動以瀏覽目錄
        </div>
      </div>
      <div
        className={cn(
          "fixed bottom-24 left-1/2 z-20 w-64 -translate-x-1/2 select-none rounded-full bg-[#c5c5c5] transition-all duration-300",
          !isEditing && isScrollByNavigator
            ? "h-12 opacity-100"
            : "h-6 opacity-50",
          isEditing && "pointer-events-none opacity-0"
        )}
        onTouchStartCapture={(e) => {
          e.stopPropagation();
          const touch = e.touches[0];
          if (touch) {
            startTouchX.current = touch.clientX;
            setIsScrollByNavigator(true);
            setTargetIndex(spaceCardIndex);
          }
        }}
        onMouseDownCapture={(e) => {
          e.stopPropagation();
          startTouchX.current = e.clientX;
          setIsScrollByNavigator(true);
          setTargetIndex(spaceCardIndex);
        }}
        onTouchMoveCapture={(e) => {
          e.stopPropagation();
          const touch = e.touches[0];
          if (!touch) {
            return;
          }

          const diff = touch.clientX - startTouchX.current;
          const diffPage = Math.round(diff / 30);
          const toTargetIndex =
            targetIndex + diffPage < 0
              ? 0
              : targetIndex + diffPage >= noteCardOrder.length
                ? noteCardOrder.length - 1
                : targetIndex + diffPage;
          setTargetIndex(toTargetIndex);

          if (diffPage !== 0) {
            startTouchX.current = touch.clientX;
            if (window.navigator.vibrate) window.navigator.vibrate(100);
          }
        }}
        onMouseMoveCapture={(e) => {
          e.stopPropagation();
          const diff = e.clientX - startTouchX.current;
          const diffPage = Math.round(diff / 30);
          const toTargetIndex =
            targetIndex + diffPage < 0
              ? 0
              : targetIndex + diffPage >= noteCardOrder.length
                ? noteCardOrder.length - 1
                : targetIndex + diffPage;
          setTargetIndex(toTargetIndex);

          if (diffPage !== 0) {
            startTouchX.current = e.clientX;
            if (window.navigator.vibrate) window.navigator.vibrate(100);
          }
        }}
        onTouchEndCapture={(e) => {
          e.stopPropagation();
          startTouchX.current = 0;
          setIsScrollByNavigator(false);
          const targetSpaceCardId = noteCardOrder[targetIndex]!;
          goTargetSpaceCard(targetSpaceCardId);
        }}
        onMouseUpCapture={(e) => {
          e.stopPropagation();
          startTouchX.current = 0;
          setIsScrollByNavigator(false);
          const targetSpaceCardId = noteCardOrder[targetIndex]!;
          goTargetSpaceCard(targetSpaceCardId);
        }}
      >
        <div className="grid h-full w-full grid-cols-7">
          <div className="flex items-center justify-center">
            {targetIndex + 1}
          </div>
          {[0, 1, 2, 3, 4].map((i) => {
            return (
              <div className="flex items-center justify-center" key={i}>
                <div
                  className={cn(
                    "h-4 rounded-full bg-[#F7F7F2] transition-all duration-300",
                    i === progress ? "col-span-2 w-8" : "col-span-1 w-4"
                  )}
                ></div>
              </div>
            );
          })}
          <div className="flex items-center justify-center">
            {noteCardOrder.length}
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileSpaceEditorPageNavigator;
