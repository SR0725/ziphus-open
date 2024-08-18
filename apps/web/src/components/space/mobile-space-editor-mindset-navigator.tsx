"use client";

import { useMemo } from "react";
import { CardPreviewer } from "../card/card-previewer";
import useMobileFocusSpaceCard from "@/hooks/space/useMobileFocusSpaceCard";
import useMobileInfiniteScrollMode from "@/hooks/space/useMobileInfiniteScrollMode";
import useMobileMindMap from "@/hooks/space/useMobileMindMap";
import { SpaceWithFullData } from "@/hooks/space/useQuerySpaceWithFullData";
import { cn } from "@/utils/cn";

function MobileSpaceEditorMindsetNavigator({
  initialSpace,
}: {
  initialSpace: SpaceWithFullData;
}) {
  //*  目前聚焦的卡片
  const { goTargetSpaceCard } = useMobileFocusSpaceCard();
  const outlineSpaceCards = useMemo(
    () =>
      initialSpace.spaceCards.filter(
        (spaceCard) => spaceCard.card?.type === "outline"
      ),
    []
  );

  const { isMindMapOpen, toggleIsMindMapOpen } = useMobileMindMap();
  const { isInfiniteScrollMode } = useMobileInfiniteScrollMode();
  if (!isMindMapOpen) return null;

  return (
    <div className="fixed left-0 top-[72px] z-50 max-h-[calc(100vh-72px)] w-screen  overflow-auto bg-[#E5E5E5] pb-64 dark:bg-[#0E0E0E]">
      <div className="mx-auto flex h-fit w-full flex-col items-center gap-2">
        {outlineSpaceCards.map((spaceCard) => {
          return (
            <div
              className={cn(
                "overflow-x-none h-fit w-[calc(100vw-48px)] overflow-y-auto overflow-x-hidden rounded-2xl bg-[#F7F7F2] px-8 py-4 dark:bg-dark-card-bg"
              )}
              key={spaceCard.id}
              onClick={() => {
                if (!spaceCard.linkLines[0]) return;
                if (isInfiniteScrollMode) {
                  const container = document.getElementById(
                    "infinite-scroll-space-editor"
                  );
                  const target = document.getElementById(
                    spaceCard.linkLines[0].endCardId
                  );
                  if (container && target) {
                    container.scrollTo({
                      top: target.offsetTop - 54,
                      behavior: "smooth",
                    });
                  }
                } else {
                  goTargetSpaceCard(spaceCard.linkLines[0].endCardId);
                }
                toggleIsMindMapOpen();
              }}
            >
              <CardPreviewer
                initialCard={spaceCard.card}
                cardId={spaceCard.targetCardId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MobileSpaceEditorMindsetNavigator;
