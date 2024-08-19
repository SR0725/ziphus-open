import { useCallback } from "react";
import useEditorStore from "@/stores/useEditorStore";
import delay from "@/utils/delay";

function useSpaceCardDragCase() {
  //* 編輯器資料
  const setEditorState = useEditorStore.setState;

  const handleDragCard = useCallback((spaceCardId: string) => {
    setEditorState({
      draggingSpaceCardList: [spaceCardId],
    });
  }, []);

  const handleEndDragAllCard = useCallback(async () => {
    await delay(10);
    setEditorState({
      draggingSpaceCardList: null,
    });
  }, []);

  return {
    handleDragCard,
    handleEndDragAllCard,
  };
}

export default useSpaceCardDragCase;
