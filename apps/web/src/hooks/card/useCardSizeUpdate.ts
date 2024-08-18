"use client";

import { useCallback, useEffect, useRef } from "react";
import useGetCard from "@/hooks/card/useGetCard";
import useCardsStore from "@/stores/useCardsStore";

// 隨時更新大小
const useCardSizeUpdate = (
  cardHTMLElementRef: React.RefObject<HTMLDivElement>,
  cardId: string,
  alwaysFullWidth: boolean = false
) => {
  useEffect(() => {
    useCardsStore.subscribe((state) => {
      handleViewChangeAnimation();
    });
    handleViewChangeAnimation();
  }, []);
  const getCard = useGetCard();

  const cardSizeRef = useRef({ width: 0, height: 0 });

  const handleViewChangeAnimation = useCallback(() => {
    const card = getCard(cardId);
    if (!card) return;
    if (!cardHTMLElementRef.current) {
      return;
    }
    if (
      card.width === cardSizeRef.current.width &&
      card.height === cardSizeRef.current.height
    ) {
      return;
    }
    cardSizeRef.current.width = card.width;
    cardSizeRef.current.height = card.height;
    if (alwaysFullWidth) {
      cardHTMLElementRef.current.style.width = "100%";
      cardHTMLElementRef.current.style.height = "auto";
    } else {
      cardHTMLElementRef.current.style.width = `${card.width}px`;
      cardHTMLElementRef.current.style.height = `${card.height}px`;
    }
  }, []);
};

export default useCardSizeUpdate;
