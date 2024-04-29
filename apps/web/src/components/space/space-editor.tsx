"use client";

import React, { useRef, useState } from "react";
import { CardEditorSEO } from "../card/card-editor";
import useCreateCard from "@/hooks/card/useCreateCard";
import useCreateSpaceCard from "@/hooks/space/useCreateSpaceCard";
import useDeleteSpaceCard from "@/hooks/space/useDeleteSpaceCard";
import { SpaceWithFullData } from "@/hooks/space/useQuerySpaceWithFullData";
import useUpdateSpaceCardLayer from "@/hooks/space/useUpdateSpaceCardLayer";
import useViewContextMenu from "@/hooks/space/useViewContextMenu";
import useViewDrag from "@/hooks/space/useViewDrag";
import useViewScroll from "@/hooks/space/useViewScroll";
import useViewTouch from "@/hooks/space/useViewTouch";
import useViewTransformUpdate from "@/hooks/space/useViewTransformUpdate";
import useCanvasEditor from "@/hooks/useCanvasEditor";
import { View } from "@/models/view";
import SpaceCardEditor from "./space-card-editor";
import ContextMenuComponent, {
  ContextMenuInfo,
} from "./space-editor-context-menu";
import SpaceToolbar from "./space-toolbar";

export default function SpaceEditor({
  initialSpace,
}: {
  initialSpace: SpaceWithFullData;
}) {
  const [space, setSpace] = useState<SpaceWithFullData>(initialSpace);

  const {
    editMode,
    setEditMode,
    sketchMode,
    setSketchMode,
    pencilInfo,
    setPencilInfo,
    eraserInfo,
    setEraserInfo,
    isUseApplePencil,
    setIsUseApplePencil,
  } = useCanvasEditor();

  const mutateDeleteSpaceCard = useDeleteSpaceCard(setSpace, space);
  const mutateCreateSpaceCard = useCreateSpaceCard(setSpace, space);
  const mutateCreateCard = useCreateCard();
  const mutateUpdateSpaceCardLayer = useUpdateSpaceCardLayer(setSpace, space);

  const viewRef = useRef<View>({
    x: 0,
    y: 0,
    scale: 1,
  });

  const whiteBoardRef = useRef<HTMLDivElement>(null);
  const parallaxBoardRef = useRef<HTMLDivElement | null>(null);
  const contextMenuComponentRef = useRef<HTMLDivElement | null>(null);
  const [isPositionLocked, setIsPositionLocked] = useState(false);
  const [focusSpaceCardId, setFocusSpaceCardId] = useState<string | null>(null);
  const mouseClickPositionRef = useRef<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedSpaceCardIdList, setSelectedSpaceCardIdList] = useState<
    string[]
  >([]);
  const [contextMenuInfo, setContextMenuInfo] =
    useState<ContextMenuInfo | null>(null);
  useViewScroll(whiteBoardRef, viewRef, !isPositionLocked, () => {
    setContextMenuInfo(null);
  });
  useViewTouch(whiteBoardRef, viewRef, !isPositionLocked, () => {
    setContextMenuInfo(null);
  });
  useViewDrag(
    whiteBoardRef,
    viewRef,
    !isPositionLocked && !focusSpaceCardId,
    () => {
      setContextMenuInfo(null);
    }
  );
  useViewContextMenu(
    whiteBoardRef,
    setContextMenuInfo,
    contextMenuComponentRef
  );
  useViewTransformUpdate(parallaxBoardRef, viewRef);

  return (
    <div
      ref={whiteBoardRef}
      className="relative h-full w-full touch-none overflow-hidden bg-black"
      onClick={() => {
        setFocusSpaceCardId(null);
        setSelectedSpaceCardIdList([]);
        setIsPositionLocked(false);
      }}
    >
      {/* 內容 */}
      <div
        className=" absolute left-0 top-0 z-0 origin-top-left"
        ref={parallaxBoardRef}
      >
        {space?.spaceCards.map((spaceCard) => (
          <SpaceCardEditor
            key={spaceCard.id}
            initialSpaceCard={spaceCard}
            viewRef={viewRef}
            isFocus={focusSpaceCardId === spaceCard.id}
            onMouseDown={(e) => {
              if (e.button !== 0) return;
              mouseClickPositionRef.current = {
                x: e.clientX,
                y: e.clientY,
              };
            }}
            onClick={(e) => {
              if (e.button !== 0) return;
              e.stopPropagation();

              const x = e.clientX;
              const y = e.clientY;
              if (
                mouseClickPositionRef.current &&
                Math.abs(x - mouseClickPositionRef.current.x) > 3 &&
                Math.abs(y - mouseClickPositionRef.current.y) > 3
              ) {
                return;
              }
              setSelectedSpaceCardIdList([spaceCard.id]);
              setFocusSpaceCardId(spaceCard.id);
            }}
            onDoubleClick={(e) => {
              const boardWidth = whiteBoardRef.current?.offsetWidth ?? 0;
              const boardHeight = whiteBoardRef.current?.offsetHeight ?? 0;
              const cardWidth = spaceCard.card?.width ?? 0;
              const cardHeight = spaceCard.card?.height ?? 0;
              const cardDom = document.getElementById(spaceCard.id);
              if (!cardDom) return;
              // get card transform position
              const cardTransform = cardDom.style.transform;
              const cardX = Number(
                cardTransform.match(/translateX\(([^)]+)px\)/)?.[1] ?? "0"
              );
              const cardY = Number(
                cardTransform.match(/translateY\(([^)]+)px\)/)?.[1] ?? "0"
              );
              e.stopPropagation();
              setFocusSpaceCardId(spaceCard.id);
              viewRef.current.x = -cardX + (boardWidth - cardWidth) / 2;
              viewRef.current.y = -cardY + (boardHeight - cardHeight) / 2;
              viewRef.current.scale = 1;
              setIsPositionLocked(true);
            }}
            layers={space.layers}
          >
            <CardEditorSEO
              initialCard={
                initialSpace?.spaceCards?.find(
                  (initialSpaceSpaceCard) =>
                    initialSpaceSpaceCard.targetCardId ===
                    spaceCard.targetCardId
                )?.card || null
              }
              cardId={spaceCard.targetCardId}
              isFocus={focusSpaceCardId === spaceCard.id}
              isEditable={true}
              editMode={editMode}
              isUseApplePencil={isUseApplePencil}
              sketchMode={sketchMode}
              pencilInfo={pencilInfo}
              eraserInfo={eraserInfo}
              spaceCardId={spaceCard.id}
            />
          </SpaceCardEditor>
        ))}
      </div>
      {/* 繪圖工具 */}
      <SpaceToolbar
        focusSpaceCardId={focusSpaceCardId}
        isPositionLocked={isPositionLocked}
        setIsPositionLocked={setIsPositionLocked}
        isUseApplePencil={isUseApplePencil}
        setIsUseApplePencil={setIsUseApplePencil}
        editMode={editMode}
        setEditMode={setEditMode}
        sketchMode={sketchMode}
        setSketchMode={setSketchMode}
        pencilInfo={pencilInfo}
        setPencilInfo={setPencilInfo}
        eraserInfo={eraserInfo}
        setEraserInfo={setEraserInfo}
        mutateCreateSpaceCard={mutateCreateSpaceCard}
        mutateCreateCard={mutateCreateCard}
        mutateDeleteSpaceCard={mutateDeleteSpaceCard}
        space={space}
        setSpace={setSpace}
        viewRef={viewRef}
        editorRef={whiteBoardRef}
      />
      {/* 右鍵生成選單 */}
      <ContextMenuComponent
        contextMenuInfo={contextMenuInfo}
        setContextMenuInfo={setContextMenuInfo}
        ref={contextMenuComponentRef}
        viewRef={viewRef}
        spaceId={space!.id}
        mutateDeleteSpaceCard={mutateDeleteSpaceCard}
        mutateCreateSpaceCard={mutateCreateSpaceCard}
        mutateCreateCard={mutateCreateCard}
        mutateUpdateSpaceCardLayer={mutateUpdateSpaceCardLayer}
        space={space}
        setSpace={setSpace}
      />
    </div>
  );
}
