"use client";

import { useEffect, useState } from "react";
import { FaApple } from "react-icons/fa";
import { FaEraser, FaPencil } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";
import {
  EditMode,
  SketchMode,
  PencilInfo,
  EraserInfo,
} from "@/components/card/card-editor-sketch-panel";
import useCreateCard from "@/hooks/card/useCreateCard";
import useCreateSpaceCard from "@/hooks/space/useCreateSpaceCard";
import useDeleteSpaceCard from "@/hooks/space/useDeleteSpaceCard";
import { SpaceWithFullData } from "@/hooks/space/useQuerySpaceWithFullData";
import { View } from "@/models/view";
import ToolbarItemAddCardButton from "./space-toolbar-add-card-button";
import ToolbarItemDeleteCardButton from "./space-toolbar-delete-card-button";
import ToolbarItemButton from "./space-toolbar-item-button";
import SpaceToolbarLayerEraser from "./space-toolbar-layer-eraser";
import SpaceToolbarLayerPencil from "./space-toolbar-layer-pencil";
import ToolbarItemPositionDeLockButton from "./space-toolbar-position-delock-button";

interface SpaceToolbarProps {
  focusSpaceCardId: string | null;
  isPositionLocked: boolean;
  setIsPositionLocked: (isLocked: boolean) => void;
  isUseApplePencil: boolean;
  setIsUseApplePencil: (isUse: boolean) => void;
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
  sketchMode: SketchMode;
  setSketchMode: (mode: SketchMode) => void;
  pencilInfo: PencilInfo;
  setPencilInfo: (info: PencilInfo) => void;
  eraserInfo: EraserInfo;
  setEraserInfo: (info: EraserInfo) => void;
  mutateCreateSpaceCard: ReturnType<typeof useCreateSpaceCard>;
  mutateCreateCard: ReturnType<typeof useCreateCard>;
  mutateDeleteSpaceCard: ReturnType<typeof useDeleteSpaceCard>;
  space: SpaceWithFullData;
  setSpace: (space: SpaceWithFullData) => void;
  viewRef: React.MutableRefObject<View>;
  editorRef: React.RefObject<HTMLDivElement>;
}
function SpaceToolbar({
  focusSpaceCardId,
  isPositionLocked,
  setIsPositionLocked,
  isUseApplePencil,
  setIsUseApplePencil,
  editMode,
  setEditMode,
  sketchMode,
  setSketchMode,
  pencilInfo,
  setPencilInfo,
  eraserInfo,
  setEraserInfo,
  mutateCreateSpaceCard,
  mutateCreateCard,
  mutateDeleteSpaceCard,
  space,
  setSpace,
  viewRef,
  editorRef,
}: SpaceToolbarProps) {
  const [selectedId, setSelectedId] = useState(0);

  useEffect(() => {
    if (!focusSpaceCardId) {
      setEditMode("text");
      setSelectedId(0);
    }
    if (editMode === "text") {
      setSelectedId(0);
    } else if (editMode === "sketch" && sketchMode === "pencil") {
      setSelectedId(1);
    } else if (editMode === "sketch" && sketchMode === "eraser") {
      setSelectedId(2);
    }
  }, [focusSpaceCardId, editMode, sketchMode]);

  return (
    <>
      {/** 第一層 */}
      <div className="absolute right-2 top-1/2 z-50 flex h-fit w-fit -translate-y-1/2 flex-col items-center">
        {/**  鉛筆 -1 */}
        {focusSpaceCardId && editMode === "sketch" && (
          <ToolbarItemButton
            isFocused={isUseApplePencil}
            onClick={(event) => {
              event.stopPropagation();
              setIsUseApplePencil(!isUseApplePencil);
            }}
          >
            <span className="text-[10px]">
              Pencil
              <br />
              Only
            </span>
          </ToolbarItemButton>
        )}
        {/** 文字編輯 0 */}
        {focusSpaceCardId && (
          <ToolbarItemButton
            isFocused={selectedId === 0}
            onClick={(event) => {
              event.stopPropagation();
              setEditMode("text");
            }}
          >
            <IoDocumentTextOutline />
          </ToolbarItemButton>
        )}
        {/**  鉛筆 1 */}
        {focusSpaceCardId && (
          <ToolbarItemButton
            isFocused={selectedId === 1}
            onClick={(event) => {
              event.stopPropagation();
              setEditMode("sketch");
              setSketchMode("pencil");
              setIsPositionLocked(true);
            }}
          >
            <FaPencil />
          </ToolbarItemButton>
        )}
        {/** 橡皮擦 2 */}
        {focusSpaceCardId && (
          <ToolbarItemButton
            isFocused={selectedId === 2}
            onClick={(event) => {
              event.stopPropagation();
              setEditMode("sketch");
              setSketchMode("eraser");
              setIsPositionLocked(true);
            }}
          >
            <FaEraser />
          </ToolbarItemButton>
        )}
        {/** 新增題目 3 */}
        {!focusSpaceCardId && (
          <ToolbarItemAddCardButton
            viewRef={viewRef}
            mutateCreateSpaceCard={mutateCreateSpaceCard}
            mutateCreateCard={mutateCreateCard}
            setSpace={setSpace}
            space={space}
            editorRef={editorRef}
            setIsPositionLocked={setIsPositionLocked}
            isPositionLocked={isPositionLocked}
          />
        )}
        {/** 取消位置聚焦 3 */}
        {isPositionLocked && (
          <ToolbarItemPositionDeLockButton
            isPositionLocked={isPositionLocked}
            setIsPositionLocked={setIsPositionLocked}
          />
        )}
        {/** 刪除題目 4 */}
        {focusSpaceCardId && (
          <ToolbarItemDeleteCardButton
            mutateDeleteSpaceCard={mutateDeleteSpaceCard}
            focusSpaceCardId={focusSpaceCardId}
            setSpace={setSpace}
            space={space}
          />
        )}
      </div>

      {/** 第二層 */}
      <div
        className="absolute right-16 top-1/2 z-50 flex h-fit w-fit -translate-y-1/2 flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {editMode === "sketch" && sketchMode === "pencil" && (
          <SpaceToolbarLayerPencil
            pencilInfo={pencilInfo}
            setPencilInfo={setPencilInfo}
          />
        )}
        {editMode === "sketch" && sketchMode === "eraser" && (
          <SpaceToolbarLayerEraser
            eraserInfo={eraserInfo}
            setEraserInfo={setEraserInfo}
          />
        )}
      </div>
    </>
  );
}

export default SpaceToolbar;
