import { useCallback, useEffect, useRef } from "react";
import useCardsStore from "@/stores/useCardsStore";

let cardIndexMap: Record<string, number> = {};
let cardsLength = 0;

function useGetCard() {
  useEffect(() => {
    useCardsStore.subscribe((state, oldState) => {
      if (state.cards.length !== cardsLength) {
        cardIndexMap = {};
        cardsLength = state.cards.length;
      }
    });
  }, []);

  const getCard = useCallback((cardId: string) => {
    if (cardIndexMap[cardId] === undefined) {
      const cards = useCardsStore.getState().cards;
      const index = cards.findIndex((c) => c.id === cardId);
      cardIndexMap[cardId] = index;
    }
    const index = cardIndexMap[cardId]!;
    return useCardsStore.getState().cards[index];
  }, []);

  return getCard;
}

export default useGetCard;
