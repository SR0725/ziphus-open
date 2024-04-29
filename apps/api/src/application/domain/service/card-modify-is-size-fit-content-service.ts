import { type CardModifyIsSizeFitContentUseCaseConstructor } from "@/application/port/in/card-modify-is-size-fit-content-use-case";
import { CardPermission } from "../model/card";

const cardModifyIsSizeFitContentUseCaseConstructor: CardModifyIsSizeFitContentUseCaseConstructor =

    (loadCard, saveCard) =>
    async ({ cardId, accountId, isSizeFitContent }) => {
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
        throw new Error("Permission denied");
      }

      // 儲存更新後的卡片
      await saveCard(
        {
          ...card,
          isSizeFitContent,
        },
        true
      );

      return true;
    };

export default cardModifyIsSizeFitContentUseCaseConstructor;
