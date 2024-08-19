import { use, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { BlockNoteEditor, BlockSchemaFromSpecs } from "@blocknote/core";
import { schema } from "@/components/blocknote/block-note-setting";
import useGetCard from "@/hooks/card/useGetCard";
import useCardsStore from "@/stores/useCardsStore";
import axiosInstance from "@/utils/axios";
import delay from "@/utils/delay";

function useUpdateCardTitleCase(
  cardId: string,
  editor: BlockNoteEditor<BlockSchemaFromSpecs<typeof schema.blockSpecs>>
) {
  // 初始化所需資料
  const getCard = useGetCard();

  const handleUpdateCardTitleCase = async () => {
    const card = getCard(cardId);
    if (!card) return;
    if (card.title) return;
    const cursorPosition = editor.getTextCursorPosition();
    if (
      cursorPosition.block.type === "heading" &&
      cursorPosition.block.props.level === 1
    ) {
      const title = (cursorPosition.block.content as any)[0].text;
      await axiosInstance.put(`/card/${cardId}/title`, {
        title,
      });
      const setCard = useCardsStore.getState().setCard;
      setCard({
        id: cardId,
        title: title,
      });
    }
  };

  const getIsWritingTitle = () => {
    const card = getCard(cardId);
    if (!card) return false;
    if (card.title) return false;
    const cursorPosition = editor.getTextCursorPosition();
    if (
      cursorPosition.block.type === "heading" &&
      cursorPosition.block.props.level === 1
    ) {
      return true;
    }
    return false;
  };

  return { handleUpdateCardTitleCase, getIsWritingTitle };
}

export default useUpdateCardTitleCase;
