import { create } from "zustand";

export interface MobileViewState {
  focusSpaceCardId: string | null;
  isEditing: boolean;
  isInfiniteScrollMode: boolean;
  noteCardOrder: string[];
  isMindMapOpen: boolean;
}

/**
 * 編輯器狀態
 */
const useMobileViewStore = create<MobileViewState>(() => ({
  focusSpaceCardId: null,
  isEditing: false,
  isInfiniteScrollMode: false,
  noteCardOrder: [],
  isMindMapOpen: false,
}));

export default useMobileViewStore;
