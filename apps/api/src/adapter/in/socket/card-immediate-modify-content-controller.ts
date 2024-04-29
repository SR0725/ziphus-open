import type {
  CardImmediateModifyContentRequestDTO,
  CardGetIsNeedImmediateModifyContentRequestDTO,
  CardGetIsNeedImmediateModifyContentResponseDTO,
  Authorization,
} from "@repo/shared-types";
import type { CardGetByIdUseCase } from "@/application/port/in/card-get-by-id-use-case";
import type { CardModifyContentUseCase } from "@/application/port/in/card-modify-content-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type IoControllerInterface from "./io-controller-interface";

// 最小存檔間隔時間
const MIN_SAVE_INTERVAL = 1000;
/**
 * 即時存檔卡片內容的 Socket.io 控制器
 * 因為考慮到反覆修改文件的問題
 * 所以再請求存檔前，需先發一個嘗試存檔的請求 (card:get-is-need-modify-content)
 * 後端會確定近3秒內是否有其他人修改過文件，若有則回傳 false
 * 若無則回傳 true，前端此時才可以發送存檔請求 (card:modify-content)
 */
const CardImmediateModifyContentController: IoControllerInterface<
  [CardGetByIdUseCase, CardModifyContentUseCase]
> = (socket, [cardGetByIdUseCase, cardModifyContent]) => {
  socket.on(
    "card:get-is-need-modify-content",
    async (
      data: CardGetIsNeedImmediateModifyContentRequestDTO & Authorization
    ) => {
      try {
        const accountToken = getAccountTokenInterfaceFromAuth(data);
        const card = await cardGetByIdUseCase({
          cardId: data.cardId,
          accountId: accountToken?.accountId,
        });

        if (!card) {
          throw new Error("Card not found");
        }

        const lastModifiedAt = new Date(card.updatedAt).getTime();
        const now = new Date().getTime();
        const diff = now - lastModifiedAt;
        const isModified = diff < MIN_SAVE_INTERVAL;

        const response: CardGetIsNeedImmediateModifyContentResponseDTO = {
          available: !isModified,
        };
        socket.emit("card:get-is-need-modify-content-response", response);
      } catch (error) {}
    }
  );
  socket.on(
    "card:modify-content",
    async (data: CardImmediateModifyContentRequestDTO & Authorization) => {
      try {
        const accountToken = getAccountTokenInterfaceFromAuth(data);

        await cardModifyContent({
          accountId: accountToken?.accountId,
          ...data,
        });
      } catch (error) {}
    }
  );
};

export default CardImmediateModifyContentController;
