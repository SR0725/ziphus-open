import { useCallback } from "react";
import { SpaceCardDTO } from "@repo/shared-types";
import useEditorStore from "@/stores/useEditorStore";

function useLinkFocus() {
  //* 編輯器資料
  const setEditorState = useEditorStore((state) => useEditorStore.setState);

  const handleFocusLink = useCallback((link: SpaceCardDTO["linkLines"][0]) => {
    setEditorState({
      focusLinkLine: {
        spaceCardId: link.startCardId,
        linkLineId: link.id,
      },
    });
  }, []);

  const handleBlurLink = useCallback(() => {
    setEditorState({
      focusLinkLine: null,
    });
  }, []);

  return {
    handleFocusLink,
    handleBlurLink,
  };
}

export default useLinkFocus;
