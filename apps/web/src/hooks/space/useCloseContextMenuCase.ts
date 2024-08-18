"use client";

import { useShallow } from "zustand/react/shallow";
import useEditorStore from "@/stores/useEditorStore";

// 右鍵單點招喚選單
const useCloseContextMenuCase = () => {
  const { closeContextMenu } = useEditorStore(
    useShallow((state) => ({
      closeContextMenu: () =>
        useEditorStore.setState({ contextMenuInfo: null }),
    }))
  );

  return closeContextMenu;
};

export default useCloseContextMenuCase;
