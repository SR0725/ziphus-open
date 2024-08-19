"use client";

import { useMemo } from "react";
import { CardPreviewer } from "../card/card-previewer";
import { SpaceCardDTO } from "@repo/shared-types";
import { SpaceWithFullData } from "@/hooks/space/useQuerySpaceWithFullData";
import useCanvasEditor from "@/hooks/useCanvasEditor";
import "@/styles/markdown-editor.css";
import { cn } from "@/utils/cn";

interface MobileSpaceCardViewProps {
  spaceCard: SpaceCardDTO;
  initialSpace: SpaceWithFullData;
}

function MobileSpaceCardInfiniteScrollPreviewer({
  spaceCard,
  initialSpace,
}: MobileSpaceCardViewProps) {
  const initialCard = useMemo(() => {
    return initialSpace?.spaceCards?.find(
      (initialSpaceSpaceCard) =>
        initialSpaceSpaceCard.targetCardId === spaceCard?.targetCardId
    )?.card;
  }, [initialSpace, spaceCard?.targetCardId]);

  return (
    <div
      className={cn(
        "markdown-render overflow-x-none relative h-fit w-full flex-shrink-0 overflow-x-hidden border-b-1 bg-[#F7F7F2] p-4 dark:bg-dark-card-bg"
      )}
      id={spaceCard.id}
    >
      <CardPreviewer
        initialCard={initialCard || null}
        cardId={spaceCard.targetCardId}
      />
    </div>
  );
}

export default MobileSpaceCardInfiniteScrollPreviewer;
