import { type CardAccessEditValidatorUseCaseConstructor } from "@/application/port/in/card-access-edit-validator-use-case";
import { CardPermission } from "../model/card";

const cardAccessEditValidatorCaseConstructor: CardAccessEditValidatorUseCaseConstructor =

    (loadCard) =>
    async ({ cardId, accountId }) => {
      const card = await loadCard({
        id: cardId,
      });
      if (!card) {
        throw new Error("Card not found");
      }

      if (
        card.permission !== CardPermission.PublicEditable &&
        card.belongAccountId !== accountId
      ) {
        return {
          available: false,
        };
      }

      return {
        available: true,
      };
    };

export default cardAccessEditValidatorCaseConstructor;
