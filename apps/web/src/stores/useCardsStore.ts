import { create } from "zustand";
import { CardDto } from "@repo/shared-types";

export interface CardsState {
  cards: CardDto[];
  initializerCard: (initialCard: CardDto) => void;
  setCard: (newState: Partial<CardDto> & { id: string }) => void;
}

const useCardsStore = create<CardsState>((set, get) => ({
  cards: [],
  initializerCard: (initialCard: CardDto) => {
    const isCardExist = get().cards.some((card) => card.id === initialCard.id);

    if (isCardExist) {
      console.warn("Card already exist");
      return;
    }
    set((state) => ({
      cards: [...state.cards, initialCard],
    }));
  },
  setCard: (newState: Partial<CardDto> & { id: string }) => {
    const isCardExist = get().cards.some((card) => card.id === newState.id);
    if (!isCardExist) {
      console.warn("Card not exist");
      return;
    }
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === newState.id ? { ...card, ...newState } : card
      ),
    }));
  },
}));

export default useCardsStore;
