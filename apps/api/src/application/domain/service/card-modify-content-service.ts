import { type CardModifyContentUseCaseConstructor } from "@/application/port/in/card-modify-content-use-case";
import { CardPermission } from "../model/card";

const cardModifyContentCaseConstructor: CardModifyContentUseCaseConstructor =
  (loadCard, saveCard) =>
  async ({ content, cardId, accountId }) => {
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
    await saveCard({ ...card, content });

    return true;
  };

export default cardModifyContentCaseConstructor;
