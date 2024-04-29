import { type CardModifySizeUseCaseConstructor } from "@/application/port/in/card-modify-size-use-case";
import { CardPermission } from "../model/card";

const cardModifySizeCaseConstructor: CardModifySizeUseCaseConstructor =
  (loadCard, saveCard) =>
    async ({ cardId, accountId, width, height }) => {
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

      if (width === undefined && height === undefined) {
        throw new Error("Width or height should be provided");
      }

      if (width !== undefined && width < 0) {
        throw new Error("Width should be positive");
      }

      if (height !== undefined && height < 0) {
        throw new Error("Height should be positive");
      }

      // 儲存更新後的卡片
      await saveCard({
        ...card,
        width: width ?? card.width,
        height: height ?? card.height,
      });

      return true;
    };

export default cardModifySizeCaseConstructor;
