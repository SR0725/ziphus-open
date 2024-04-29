import { type CardModifyTitleUseCaseConstructor } from "@/application/port/in/card-modify-title-use-case";
import { CardPermission } from "../model/card";

const cardModifyTitleCaseConstructor: CardModifyTitleUseCaseConstructor =
  (loadCard, saveCard) =>
  async ({ title, cardId, accountId }) => {
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
    await saveCard({ ...card, title });

    return true;
  };

export default cardModifyTitleCaseConstructor;
