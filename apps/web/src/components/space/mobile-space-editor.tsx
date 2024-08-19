"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useShallow } from "zustand/react/shallow";
import useGetCard from "@/hooks/card/useGetCard";
import useMobileFocusSpaceCard from "@/hooks/space/useMobileFocusSpaceCard";
import useMobileInfiniteScrollMode from "@/hooks/space/useMobileInfiniteScrollMode";
import useMobileIsEditing from "@/hooks/space/useMobileIsEditing";
import { SpaceWithFullData } from "@/hooks/space/useQuerySpaceWithFullData";
import useSpaceStoreInitialCase from "@/hooks/space/useSpaceStoreInitialCase";
import useSpaceStore from "@/stores/useSpaceStore";
import MobileSpaceCardInfiniteScrollPreviewer from "./mobile-space-card-infinite-scroll-previewer";
import MobileSpaceCardNormalPreviewer from "./mobile-space-card-normal-previewer";
import MobileSpaceEditorMindsetNavigator from "./mobile-space-editor-mindset-navigator";
import MobileSpaceEditorPageNavigator from "./mobile-space-editor-page-navigator";

function MobileSpaceEditorNormalInspector({
  initialSpace,
}: {
  initialSpace: SpaceWithFullData;
}) {
  const { spaceCards } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
      spaceCards: state.spaceCards,
    }))
  );

  //*  目前聚焦的卡片
  const {
    focusSpaceCard,
    getNextSpaceCardId,
    getPrevSpaceCardId,
    goTargetSpaceCard,
    getIsBehindFocusSpaceCard,
  } = useMobileFocusSpaceCard(
    initialSpace.spaceCards.filter(
      (spaceCard) => spaceCard.card?.type === "book"
    )[0]?.id || null
  );

  //* 滑動卡片
  const offsetXRef = useRef(0);
  const nextTargetCardIdRef = useRef<string | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isScrollByNavigator, setIsScrollByNavigator] = useState(false);
  const { isEditing } = useMobileIsEditing();

  const handlers = useSwipeable({
    onSwipeStart: () => {
      if (isEditing) return;
      setIsSwiping(true);
    },
    onSwiping: (eventData) => {
      if (isEditing) return;
      const deltaX = eventData.deltaX;
      offsetXRef.current = deltaX;
      const targetSpaceCardId =
        deltaX > 1
          ? getPrevSpaceCardId()
          : deltaX < -1
            ? getNextSpaceCardId()
            : null;
      nextTargetCardIdRef.current = targetSpaceCardId;
    },
    onSwiped: async (eventData) => {
      if (isEditing) return;
      const deltaX = eventData.deltaX;
      const targetSpaceCardId =
        deltaX > 64
          ? getPrevSpaceCardId()
          : deltaX < -64
            ? getNextSpaceCardId()
            : null;

      if (targetSpaceCardId) {
        goTargetSpaceCard(targetSpaceCardId);
      }
      setIsSwiping(false);
    },
    preventScrollOnSwipe: false,
    trackMouse: true,
    trackTouch: true,
  });

  const getCard = useGetCard();
  const noteSpaceCards = useMemo(
    () =>
      spaceCards.filter(
        (spaceCard) => getCard(spaceCard.targetCardId)?.type === "book"
      ),
    [spaceCards.length]
  );

  return (
    <div className="h-fit w-fit px-6">
      <div className="relative" {...handlers} style={{ touchAction: "pan-y" }}>
        {noteSpaceCards.map((spaceCard) => {
          const isFocusCard = spaceCard.id === focusSpaceCard?.id;

          return (
            <MobileSpaceCardNormalPreviewer
              key={spaceCard.id}
              spaceCard={spaceCard}
              isFocusCard={isFocusCard}
              offsetXRef={offsetXRef}
              isSwiping={isSwiping}
              initialSpace={initialSpace}
              nextTargetCardIdRef={nextTargetCardIdRef}
              isBehindFocusCard={getIsBehindFocusSpaceCard(spaceCard.id)}
              isScrollByNavigator={isScrollByNavigator}
            />
          );
        })}
        <MobileSpaceEditorPageNavigator
          isScrollByNavigator={isScrollByNavigator}
          setIsScrollByNavigator={setIsScrollByNavigator}
        />
      </div>
    </div>
  );
}

function MobileSpaceEditorInfiniteScrollInspector({
  initialSpace,
}: {
  initialSpace: SpaceWithFullData;
}) {
  const getCard = useGetCard();
  const { spaceCards } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
      spaceCards: state.spaceCards,
    }))
  );

  const noteSpaceCards = useMemo(
    () =>
      spaceCards.filter(
        (spaceCard) => getCard(spaceCard.targetCardId)?.type === "book"
      ),
    [spaceCards.length]
  );

  return (
    <div
      className="mx-auto flex h-[calc(100vh-60px)] w-[calc(100vw-48px)] flex-col overflow-y-auto overflow-x-hidden rounded-2xl"
      id="infinite-scroll-space-editor"
    >
      {noteSpaceCards.map((spaceCard) => {
        return (
          <MobileSpaceCardInfiniteScrollPreviewer
            key={spaceCard.id}
            spaceCard={spaceCard}
            initialSpace={initialSpace}
          />
        );
      })}
    </div>
  );
}

function MobileSpaceEditor({
  initialSpace,
}: {
  initialSpace: SpaceWithFullData;
}) {
  //* 初始化空間資料
  const initialSpaceStore = useSpaceStoreInitialCase();
  useEffect(() => {
    initialSpaceStore(initialSpace);
  }, [initialSpace]);

  const { isInfiniteScrollMode } = useMobileInfiniteScrollMode();

  return (
    <>
      {isInfiniteScrollMode ? (
        <MobileSpaceEditorInfiniteScrollInspector initialSpace={initialSpace} />
      ) : (
        <MobileSpaceEditorNormalInspector initialSpace={initialSpace} />
      )}
      <MobileSpaceEditorMindsetNavigator initialSpace={initialSpace} />
    </>
  );
}

export default MobileSpaceEditor;
