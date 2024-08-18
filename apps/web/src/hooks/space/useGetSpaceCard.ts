import { useCallback, useEffect, useRef } from "react";
import useSpaceStore from "@/stores/useSpaceStore";

let spaceCardIndexMap: Record<string, number> = {};
let spaceCardsLength = 0;

function useGetSpaceCard() {
  useEffect(() => {
    useSpaceStore.subscribe((state, oldState) => {
      if (state.spaceCards.length !== spaceCardsLength) {
        spaceCardIndexMap = {};
        spaceCardsLength = state.spaceCards.length;
      }
    });
  }, []);

  const getSpaceCard = useCallback((spaceCardId: string) => {
    if (spaceCardIndexMap[spaceCardId] === undefined) {
      const spaceCards = useSpaceStore.getState().spaceCards;
      const index = spaceCards.findIndex((sc) => sc.id === spaceCardId);
      spaceCardIndexMap[spaceCardId] = index;
    }
    const index = spaceCardIndexMap[spaceCardId]!;
    return useSpaceStore.getState().spaceCards[index];
  }, []);

  return getSpaceCard;
}

export default useGetSpaceCard;
