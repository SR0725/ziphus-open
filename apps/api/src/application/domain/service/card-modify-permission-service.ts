import { type CardModifyPermissionUseCaseConstructor } from "@/application/port/in/card-modify-permission-use-case";
import { CardPermission } from "../model/card";

const cardModifyPermissionUseCaseConstructor: CardModifyPermissionUseCaseConstructor =

    (loadCard, saveCard) =>
    async ({ permission, cardId, accountId }) => {
      const card = await loadCard({
        id: cardId,
      });
      if (!card) {
        throw new Error("Card not found");
      }

      if (card.belongAccountId !== accountId) {
        throw new Error("Permission denied");
      }

      // 判斷 permission 是否在 在 CardPermission 中
      if (!(Object as any).values(CardPermission).includes(permission)) {
        throw new Error("Invalid permission");
      }

      // 儲存更新後的卡片
      await saveCard({
        ...card,
        permission: permission as CardPermission,
      });

      return true;
    };

export default cardModifyPermissionUseCaseConstructor;
