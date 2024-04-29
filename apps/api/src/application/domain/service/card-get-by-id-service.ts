import { type CardGetByIdUseCaseConstructor } from "@/application/port/in/card-get-by-id-use-case";
import { CardPermission } from "../model/card";

const cardGetByIdUseCaseConstructor: CardGetByIdUseCaseConstructor =
  (loadCard) =>
  async ({ cardId, accountId }) => {
    const card = await loadCard({
      id: cardId,
    });
    if (!card) {
      throw new Error("Card not found");
    }
    if (
      card.permission === CardPermission.Private &&
      card.belongAccountId !== accountId
    ) {
      throw new Error("Permission denied");
    }

    return card;
  };

export default cardGetByIdUseCaseConstructor;
