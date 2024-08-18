"use client";

import React, { useEffect, useRef } from "react";
import { CardEditorPreviewer } from "../card/card-editor";
import { useShallow } from "zustand/react/shallow";
import useUpdateCardIsSizeFitContentSocketManagement from "@/hooks/card/useUpdateCardIsSizeFitContentSocketManagement";
import useUpdateCardSizeSocketManagement from "@/hooks/card/useUpdateCardSizeSocketManagement";
import useCreateSpaceCardByPdfCaseSocketManagement from "@/hooks/space/useCreateSpaceCardByPdfSocketManagement";
import useCreateSpaceCardCaseSocketManagement from "@/hooks/space/useCreateSpaceCardCaseSocketManagement";
import useCreateSpaceCardLinkSocketManagement from "@/hooks/space/useCreateSpaceCardLinkSocketManagement";
import useDeleteSpaceCardLinkSocketManagement from "@/hooks/space/useDeleteSpaceCardLinkSocketManagement.";
import useDeleteSpaceCardSocketManagement from "@/hooks/space/useDeleteSpaceCardSocketManagement";
import useLinkFocus from "@/hooks/space/useLinkFocus";
import { SpaceWithFullData } from "@/hooks/space/useQuerySpaceWithFullData";
import useSpaceCardFocusCase from "@/hooks/space/useSpaceCardFocusCase";
import useSpaceStoreInitialCase from "@/hooks/space/useSpaceStoreInitialCase";
import useUpdateSpaceCardLayerSocketManagement from "@/hooks/space/useUpdateSpaceCardLayerSocketManagement";
import useViewContextMenuCase from "@/hooks/space/useViewContextMenuCase";
import useViewDragCase from "@/hooks/space/useViewDragCase";
import useViewScrollCase from "@/hooks/space/useViewScrollCase";
import useViewTouchCase from "@/hooks/space/useViewTouchCase";
import useViewTransformUpdate from "@/hooks/space/useViewTransformUpdate";
import useCanvasEditor from "@/hooks/useCanvasEditor";
import useEditorStore from "@/stores/useEditorStore";
import useSpaceStore from "@/stores/useSpaceStore";
import SpaceCardEditor from "./space-card-editor";
import ContextMenuComponent from "./space-editor-context-menu";
import SpaceToolbar from "./space-toolbar";

export default function SpaceEditor({
  initialSpace,
}: {
  initialSpace: SpaceWithFullData;
}) {
  //* 取得空間資料
  const { spaceCards } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
      spaceCards: state.spaceCards,
    }))
  );
  //* 初始化空間資料
  const initialSpaceStore = useSpaceStoreInitialCase();
  useEffect(() => {
    initialSpaceStore(initialSpace);
  }, [initialSpace]);
  //* 焦點卡片
  const focusSpaceCardId = useEditorStore((state) => state.focusSpaceCardId);

  const { handleBlurCard } = useSpaceCardFocusCase();
  const { handleBlurLink } = useLinkFocus();

  const globalCanvasEditorSettings = useCanvasEditor();

  const whiteBoardRef = useRef<HTMLDivElement>(null);
  const parallaxBoardRef = useRef<HTMLDivElement | null>(null);
  const contextMenuComponentRef = useRef<HTMLDivElement | null>(null);
  useViewContextMenuCase(whiteBoardRef, contextMenuComponentRef);

  useCreateSpaceCardLinkSocketManagement();
  useUpdateCardIsSizeFitContentSocketManagement();
  useUpdateCardSizeSocketManagement();
  useCreateSpaceCardCaseSocketManagement();
  useDeleteSpaceCardSocketManagement();
  useUpdateSpaceCardLayerSocketManagement();
  useUpdateSpaceCardLayerSocketManagement();
  useDeleteSpaceCardLinkSocketManagement();
  useCreateSpaceCardByPdfCaseSocketManagement();

  useViewScrollCase(whiteBoardRef);
  useViewTouchCase(whiteBoardRef);
  useViewDragCase(whiteBoardRef);
  useViewTransformUpdate(parallaxBoardRef);

  return (
    <div
      ref={whiteBoardRef}
      className="relative h-full w-full touch-none overflow-hidden bg-[#E5E5E5] dark:bg-black"
      onClick={() => {
        handleBlurCard();
        handleBlurLink();
      }}
    >
      {/* 內容 */}
      <div
        className=" absolute left-0 top-0 z-0 origin-top-left"
        ref={parallaxBoardRef}
      >
        {(spaceCards || initialSpace.spaceCards).map((spaceCard) => (
          <SpaceCardEditor key={spaceCard.id} spaceCardId={spaceCard.id}>
            <CardEditorPreviewer
              initialCard={
                initialSpace?.spaceCards?.find(
                  (initialSpaceSpaceCard) =>
                    initialSpaceSpaceCard.targetCardId ===
                    spaceCard.targetCardId
                )?.card || null
              }
              cardId={spaceCard.targetCardId}
              isEditable={focusSpaceCardId === spaceCard.id}
              spaceCardId={spaceCard.id}
              canvasEditorSettings={globalCanvasEditorSettings}
            />
          </SpaceCardEditor>
        ))}
      </div>
      {/* Right Toolbar */}
      <SpaceToolbar
        editorRef={whiteBoardRef}
        canvasEditorSettings={globalCanvasEditorSettings}
      />
      {/* 右鍵生成選單 */}
      <ContextMenuComponent ref={contextMenuComponentRef} />
    </div>
  );
}
