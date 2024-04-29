import { type CardGetWithAllUseCaseConstructor } from "@/application/port/in/card-get-with-all-use-case";

const cardGetWithAllUseCaseConstructor: CardGetWithAllUseCaseConstructor =
  (loadCardList) =>
  async ({ accountId }) => {
    const cards =
      (await loadCardList({
        belongAccountId: accountId,
      })) || [];

    return cards;
  };

export default cardGetWithAllUseCaseConstructor;
