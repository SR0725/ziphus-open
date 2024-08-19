import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { BlockNoteEditor, BlockSchemaFromSpecs } from "@blocknote/core";
import { schema } from "@/components/blocknote/block-note-setting";
import useGetCard from "@/hooks/card/useGetCard";
import useCardsStore from "@/stores/useCardsStore";
import axiosInstance from "@/utils/axios";
import delay from "@/utils/delay";

function fetchEmptyCardNeedModifyContent(cardId: string) {
  return axiosInstance.put(`/card/${cardId}/content`, {
    content: "",
  });
}

// 修改卡片內容
// 附註：由於目前後端很難修改直接修改 YJS 的 Binary Data(受限於他的 schema　不公開)
// 所以這邊"多此一舉的"透過前端來修改，經評估是安全的
// TODO: 後續應該要改成後端直接修改 YJS 的 Binary Data
function useChangeCardContentCase(
  cardId: string,
  editor: BlockNoteEditor<BlockSchemaFromSpecs<typeof schema.blockSpecs>>
) {
  // 初始化所需資料
  const getCard = useGetCard();

  useEffect(() => {
    const { setCard } = useCardsStore.getState();
    async function handleUpdateContent() {
      await delay(100);
      const card = getCard(cardId);
      if (!card) return;

      const modifyContent = card.modifyContent;
      if (modifyContent) {
        const blocks = await editor.tryParseMarkdownToBlocks(modifyContent);
        editor.replaceBlocks(editor.document, blocks);
        setCard({
          ...card,
          modifyContent: "",
        });
        await fetchEmptyCardNeedModifyContent(cardId);
      }
    }
    handleUpdateContent();
  }, []);
}

export default useChangeCardContentCase;
