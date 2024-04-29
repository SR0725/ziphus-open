import { useCallback, useEffect, useRef, useState } from "react";
import {
  CardGetIsNeedImmediateModifyContentRequestDTO,
  CardGetIsNeedImmediateModifyContentResponseDTO,
  CardImmediateModifyContentRequestDTO,
} from "@repo/shared-types";
import useSocket from "@/hooks/useSocket";

const MIN_SAVE_INTERVAL = 1000;
function useUpdateCardContent(cardId: string) {
  const { socketEmitWithAuth, socket } = useSocket();
  const [content, setContent] = useState<string>("");
  const lastCardContentUpdateTimeRef = useRef<number>(new Date().getTime());

  const tryUpdateCardContent = useCallback(
    (content: string) => {
      // 如果距離上次存檔時間小於 3 秒，則不發送存檔請求
      if (
        new Date().getTime() - lastCardContentUpdateTimeRef.current <
        MIN_SAVE_INTERVAL
      ) {
        return;
      }

      // 當卡片內容改變時，發送詢問是否需要立即存檔的請求
      socketEmitWithAuth("card:get-is-need-modify-content", {
        cardId,
      } as CardGetIsNeedImmediateModifyContentRequestDTO);

      setContent(content);
    },
    [cardId]
  );

  useEffect(() => {
    // 當收到回應時，若需要立即存檔，則發送存檔請求
    socket?.on(
      "card:get-is-need-modify-content-response",
      (data: CardGetIsNeedImmediateModifyContentResponseDTO) => {
        if (data.available) {
          socketEmitWithAuth("card:modify-content", {
            cardId,
            content,
          } as CardImmediateModifyContentRequestDTO);

          lastCardContentUpdateTimeRef.current = new Date().getTime();
        }
      }
    );

    return () => {
      socket?.off("card:get-is-need-modify-content-response");
    };
  }, [cardId, content]);

  return tryUpdateCardContent;
}

export default useUpdateCardContent;
