import { CardDto } from "@repo/shared-types";
import useCardsStore from "@/stores/useCardsStore";


function useCardStoreInitialCase() {
  const initializerCard = useCardsStore((state) => state.initializerCard);

  const cardStoreInitialUseCase = (initialCard: CardDto) => {
    initializerCard(initialCard);
  };

  return cardStoreInitialUseCase;
}

export default useCardStoreInitialCase;