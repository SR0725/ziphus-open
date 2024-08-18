import useCardsStore from "@/stores/useCardsStore";
import useMobileViewStore from "@/stores/useMobileViewStore";
import useSpaceStore from "@/stores/useSpaceStore";
import { SpaceWithFullData } from "./useQuerySpaceWithFullData";


function useSpaceStoreInitialCase() {
  const setSpace = useSpaceStore((state) => useSpaceStore.setState);
  const initializerCard = useCardsStore((state) => state.initializerCard);

  const spaceStoreInitialUseCase = (initialSpace: SpaceWithFullData) => {
    setSpace(initialSpace);
    initialSpace.spaceCards.forEach((spaceCard) => {
      const card = spaceCard.card;
      if (!card) return;
      initializerCard(card);
    });
    useMobileViewStore.setState({
      noteCardOrder: initialSpace.spaceCards
        .filter((spaceCard) => spaceCard.card?.type === "book")
        .map((spaceCard) => spaceCard.id),
    });
  };

  return spaceStoreInitialUseCase;
}

export default useSpaceStoreInitialCase;