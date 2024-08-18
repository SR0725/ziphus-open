import { create } from "zustand";
import { ContextMenuInfo } from "@/components/space/space-editor-context-menu";
import { DraggingLinkData } from "@/models/dragging-link-data";
import { View } from "@/models/view";

export interface EditorState {
  // 視野所在位置與縮放大小
  view: View;
  // 是否鎖定視野操作
  isViewLocked: boolean;
  // 拖曳連結資料
  draggingLinkData: DraggingLinkData;
  // 焦點空間卡片 ID
  focusSpaceCardId: string | null;
  // 焦點連結
  focusLinkLine: { spaceCardId: string; linkLineId: string } | null;
  // 選取的空間卡片 ID 列表
  selectedSpaceCardIdList: string[];
  // 右鍵菜單項目
  contextMenuInfo: ContextMenuInfo | null;
  // 是否正在拖動視窗
  isDraggingView: boolean;
  // 是否正在拖動卡片
  draggingSpaceCardList: string[] | null;
}

/**
 * 編輯器狀態
 */
const useEditorStore = create<EditorState>(() => ({
  view: {
    x: 0,
    y: 0,
    scale: 1,
  },
  isViewLocked: false,
  draggingLinkData: {
    isFocusLinkDot: false,
    isLinking: false,
    fromSpaceCardId: "",
    toSpaceCardId: "",
    fromSpaceCardDirection: "right",
    toSpaceCardDirection: "left",
  },
  focusLinkLine: null,
  focusSpaceCardId: "",
  selectedSpaceCardIdList: [],
  contextMenuInfo: null,
  isDraggingView: false,
  draggingSpaceCardList: null,
}));

export default useEditorStore;
