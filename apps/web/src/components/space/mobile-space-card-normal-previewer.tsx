"use client";

import { useEffect, useMemo, useRef } from "react";
import { CardPreviewer } from "../card/card-previewer";
import { SpaceCardDTO } from "@repo/shared-types";
import useMobileIsEditing from "@/hooks/space/useMobileIsEditing";
import { SpaceWithFullData } from "@/hooks/space/useQuerySpaceWithFullData";
import useCanvasEditor from "@/hooks/useCanvasEditor";
import "@/styles/markdown-editor.css";
import { cn } from "@/utils/cn";

interface MobileSpaceCardViewProps {
  spaceCard: SpaceCardDTO;
  initialSpace: SpaceWithFullData;
  isFocusCard: boolean;
  offsetXRef: React.MutableRefObject<number>;
  isSwiping: boolean;
  nextTargetCardIdRef: React.MutableRefObject<string | null>;
  isBehindFocusCard: boolean;
  isScrollByNavigator: boolean;
}

/**
 * 動畫分兩種
 * - 滑動動畫
 *   - 只在滑動中撥放的動畫
 *   - 只會被統一觸發
 * - 結束動畫
 *   - 滑動結束後的動畫
 *   - 一旦觸發後，會一直撥放到結束
 */
function MobileSpaceCardNoewPreviewer({
  spaceCard,
  isFocusCard,
  isSwiping,
  isBehindFocusCard,
  initialSpace,
  nextTargetCardIdRef,
  offsetXRef,
  isScrollByNavigator,
}: MobileSpaceCardViewProps) {
  const isFocusCardRef = useRef(isFocusCard);
  const animationTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastOffsetXRef = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  // 結束動畫
  const playingUpAnimationRef = useRef<number>(0);
  const playingSwipingAnimationRef = useRef<number>(0);

  //* 渲染動畫
  useEffect(() => {
    // 處理卡片淡入動畫
    // 時間 300 ms
    // 結束動畫的一種
    function handleCardFading() {
      if (!cardRef.current) return;
      if (!isFocusCard) return;
      if (playingUpAnimationRef.current) {
        cancelAnimationFrame(playingUpAnimationRef.current);
        playingUpAnimationRef.current = 0;
      }
      animationTimeRef.current += Date.now() - lastTimeRef.current;
      lastTimeRef.current = Date.now();

      cardRef.current.style.transform = `translateX(0px) translateY(0px)`;
      cardRef.current.style.display = "block";
      cardRef.current.style.opacity = 0.5 + animationTimeRef.current / 600 + "";
      if (animationTimeRef.current < 300) {
        playingUpAnimationRef.current = requestAnimationFrame(handleCardFading);
      } else {
        cardRef.current.style.opacity = "1";
        cardRef.current.style.display = "block";
        cardRef.current.style.pointerEvents = "auto";
        cardRef.current.style.opacity = "1";
        cardRef.current.style.zIndex = "3";
        animationTimeRef.current = 0;
        playingUpAnimationRef.current = 0;
      }
    }

    // 處理卡片淡出動畫
    // 時間 300 ms
    // 結束動畫的一種
    function handleCardFadingOut() {
      if (!cardRef.current) return;
      if (isFocusCard) return;
      if (playingUpAnimationRef.current) {
        cancelAnimationFrame(playingUpAnimationRef.current);
        playingUpAnimationRef.current = 0;
      }

      animationTimeRef.current += Date.now() - lastTimeRef.current;
      lastTimeRef.current = Date.now();

      const deltaX =
        (lastOffsetXRef.current > 0 ? 1 : -1) * animationTimeRef.current * 3;
      cardRef.current.style.opacity = 1 - animationTimeRef.current / 300 + "";
      cardRef.current.style.transform = `translateX(${
        lastOffsetXRef.current + deltaX
      }px) translateY(${Math.abs((lastOffsetXRef.current + deltaX) / 10)}px)`;

      if (animationTimeRef.current < 300) {
        playingUpAnimationRef.current =
          requestAnimationFrame(handleCardFadingOut);
      } else {
        cardRef.current.style.opacity = "0";
        cardRef.current.style.zIndex = "1";
        animationTimeRef.current = 0;
        cardRef.current.style.display = "none";
        playingUpAnimationRef.current = 0;
      }
    }

    // 滑動後恢復原位
    // 結束動畫的一種
    function handleCardSwipingBack() {
      if (!cardRef.current) return;
      if (playingUpAnimationRef.current) {
        cancelAnimationFrame(playingUpAnimationRef.current);
        playingUpAnimationRef.current = 0;
      }
      offsetXRef.current *= 0.9;
      cardRef.current.style.transform = `translateX(${offsetXRef.current}px) translateY(${Math.abs(
        offsetXRef.current / 10
      )}px)`;
      if (Math.abs(offsetXRef.current) < 1) {
        offsetXRef.current = 0;
        cardRef.current.style.transform = `translateX(0) translateY(0)`;
        cardRef.current.style.opacity = "1";
        cardRef.current.style.zIndex = "3";
        cardRef.current.style.pointerEvents = "auto";
        playingUpAnimationRef.current = 0;
      } else {
        playingUpAnimationRef.current = requestAnimationFrame(
          handleCardSwipingBack
        );
      }
    }

    // 滑動中的動畫
    function handleCardSwiping() {
      if (!cardRef.current) return;
      if (playingUpAnimationRef.current) return;
      cardRef.current.style.transform = `translateX(${offsetXRef.current}px) translateY(${Math.abs(
        offsetXRef.current / 10
      )}px)`;
      cardRef.current.style.zIndex = "3";
    }

    // 冒出展示卡片
    function handleCardPreviewIn() {
      if (!cardRef.current) return;
      if (playingUpAnimationRef.current) return;
      cardRef.current.style.display = "block";
      cardRef.current.style.pointerEvents = "none";
      cardRef.current.style.opacity = "0.5";
      cardRef.current.style.zIndex = "2";
      cardRef.current.style.transform = `translateX(0px) translateY(0px)`;
    }

    // 冒離展示卡片
    function handleCardPreviewOut() {
      if (!cardRef.current) return;
      if (playingUpAnimationRef.current) return;
      cardRef.current.style.display = "none";
      cardRef.current.style.zIndex = "1";
      cardRef.current.style.transform = `translateX(0px) translateY(0px)`;
    }

    // 滑動中的動畫
    function swipingAnimationFrame() {
      if (!cardRef.current) return;
      // 如果正在播放結束動畫，則不執行滑動中的動畫
      if (playingUpAnimationRef.current) return;
      // 如果是聚焦卡片，則執行滑動中的動畫
      lastOffsetXRef.current = offsetXRef.current;
      if (isFocusCard) {
        handleCardSwiping();
      }

      // 如果可能是下一個目標卡片，則執行冒出展示卡片
      if (isBehindFocusCard && nextTargetCardIdRef.current === spaceCard?.id) {
        handleCardPreviewIn();
      }

      // 如果在聚焦卡片旁邊，則執行冒離展示卡片
      if (isBehindFocusCard && nextTargetCardIdRef.current !== spaceCard?.id) {
        handleCardPreviewOut();
      }

      if (offsetXRef.current !== 0) {
        playingSwipingAnimationRef.current = requestAnimationFrame(
          swipingAnimationFrame
        );
      }
    }

    // 如果透過導覽器滾動，則不執行動畫
    if (isScrollByNavigator && isFocusCard) {
      if (!cardRef.current) {
        return;
      }
      cardRef.current.style.display = "block";
      cardRef.current.style.opacity = "1";
    }

    // 如果不是透過導覽器滾動，則執行動畫
    if (!isScrollByNavigator && !isSwiping) {
      // 處理滑動結束後的動畫
      // 滑動結束後，如果原本不是聚焦卡片，如果是聚焦卡片，則開始淡入動畫
      if (!isFocusCardRef.current && isFocusCard) {
        lastTimeRef.current = Date.now();
        handleCardFading();
        isFocusCardRef.current = true;
      } else if (isFocusCardRef.current && !isFocusCard) {
        // 滑動結束後，如果原本是聚焦卡片，但現在不是聚焦卡片，則開始淡出動畫
        lastTimeRef.current = Date.now();
        handleCardFadingOut();
        isFocusCardRef.current = false;
      } else if (isFocusCardRef.current && isFocusCard) {
        // 滑動結束後，如果原本是聚焦卡片，但現在還是聚焦卡片，則開始復位動畫
        setTimeout(() => {
          if (isFocusCardRef.current) {
            handleCardSwipingBack();
          }
        }, 17);
      }
    } else if (!isScrollByNavigator && isSwiping) {
      // 處理滑動中的動畫
      playingSwipingAnimationRef.current = requestAnimationFrame(
        swipingAnimationFrame
      );
    }

    return () => {
      if (playingSwipingAnimationRef.current) {
        cancelAnimationFrame(playingSwipingAnimationRef.current);
      }
      if (cardRef.current) {
        if (!isBehindFocusCard && !isFocusCard) {
          cardRef.current.style.display = "none";
        } else {
          cardRef.current.style.display = "block";
        }
      }
    };
  }, [
    spaceCard?.id,
    isSwiping,
    isFocusCard,
    isBehindFocusCard,
    isScrollByNavigator,
  ]);

  useEffect(() => {
    if (!cardRef.current) return;
    if (isFocusCard) {
      cardRef.current.style.display = "block";
    } else {
      cardRef.current.style.display = "none";
    }
  }, []);

  const { isEditing } = useMobileIsEditing();
  const initialCard = useMemo(() => {
    return initialSpace?.spaceCards?.find(
      (initialSpaceSpaceCard) =>
        initialSpaceSpaceCard.targetCardId === spaceCard?.targetCardId
    )?.card;
  }, [initialSpace, spaceCard?.targetCardId]);

  return (
    <div
      className={cn(
        "overflow-x-none absolute h-[calc(100vh-60px-96px)] w-[calc(100vw-48px)] overflow-y-auto overflow-x-hidden rounded-2xl bg-[#F7F7F2] p-4 dark:bg-dark-card-bg"
      )}
      ref={cardRef}
    >
      <CardPreviewer
        initialCard={initialCard || null}
        cardId={spaceCard.targetCardId}
      />
    </div>
  );
}

export default MobileSpaceCardNoewPreviewer;
