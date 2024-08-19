import { useCallback, useEffect, useRef } from "react";
import { SpaceCardDTO } from "@repo/shared-types";
import useSpaceStore from "@/stores/useSpaceStore";
import useGetSpaceCard from "./useGetSpaceCard";

// 隨時更新位置
const useSpaceCardTransformUpdate = (
  spaceCardHTMLElementRef: React.RefObject<HTMLDivElement>,
  spaceCardId: string
) => {
  // 初始化所需資料
  const getSpaceCard = useGetSpaceCard();
  const lastSpaceCardPositionRef = useRef<{
    x: number;
    y: number;
  } | null>(null);
  const animationRef = useRef<number | null>(null);
  useEffect(() => {
    useSpaceStore.subscribe((state) => {
      const spaceCard = getSpaceCard(spaceCardId);
      if (!spaceCard) return;
      if (
        spaceCard.x !== lastSpaceCardPositionRef.current?.x ||
        spaceCard.y !== lastSpaceCardPositionRef.current?.y
      ) {
        handleAnimationStart();
      }
    });

    setTimeout(() => {
      handleAnimationStart();
    }, 10);
  }, []);

  const handleAnimationStart = useCallback(() => {
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(() => {
        handleViewChange();
        animationRef.current = null;
      });
    }
  }, []);

  const handleViewChange = useCallback(() => {
    const spaceCardElement = spaceCardHTMLElementRef.current;
    if (!spaceCardElement) {
      return;
    }

    const spaceCard = getSpaceCard(spaceCardId);
    if (!spaceCard) {
      return;
    }

    lastSpaceCardPositionRef.current = {
      x: spaceCard.x,
      y: spaceCard.y,
    };
    spaceCardElement.style.transform = `translateX(${spaceCard.x}px) translateY(${spaceCard.y}px)`;
  }, []);
};

export default useSpaceCardTransformUpdate;
