import { useCallback } from "react";
import useEditorStore from "@/stores/useEditorStore";

function useSpaceCardFocusCase() {
  //* 編輯器資料
  const setEditorState = useEditorStore.setState

  const handleFocusCard = useCallback((spaceCardId: string) => {
    setEditorState({
      focusSpaceCardId: spaceCardId,
      selectedSpaceCardIdList: [spaceCardId],
    });
  }, []);

  const handleBlurCard = useCallback(() => {
    setEditorState({
      focusSpaceCardId: null,
      selectedSpaceCardIdList: [],
      isViewLocked: false,
    });
  }, []);

  return {
    handleFocusCard,
    handleBlurCard,
  };
}

export default useSpaceCardFocusCase;
