"use client";

import { FaLink } from "react-icons/fa";
import { FaEraser, FaPencil } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import useDeleteSpaceCardLinkCase from "@/hooks/space/useDeleteSpaceCardLinkCase";
import useCanvasEditor from "@/hooks/useCanvasEditor";
import useEditorStore from "@/stores/useEditorStore";
import ToolbarItemAddCardButton from "./space-toolbar-add-card-button";
import ToolbarItemAddSpaceCardByPdfButton from "./space-toolbar-add-space-card-by-pdf";
import ToolbarItemAddSpaceCardByWebButton from "./space-toolbar-add-space-card-by-web";
import ToolbarItemDeleteCardButton from "./space-toolbar-delete-card-button";
import ToolbarItemDeleteLinkButton from "./space-toolbar-delete-link-button";
import ToolbarItemButton from "./space-toolbar-item-button";
import SpaceToolbarLayerEraser from "./space-toolbar-layer-eraser";
import SpaceToolbarLayerPencil from "./space-toolbar-layer-pencil";

interface SpaceToolbarProps {
  editorRef: React.RefObject<HTMLDivElement>;
  canvasEditorSettings: ReturnType<typeof useCanvasEditor>;
}

function SpaceToolbarCanvasSetting({
  canvasEditorSettings,
}: SpaceToolbarProps) {
  const { focusSpaceCardId } = useEditorStore(
    useShallow((state) => ({
      focusSpaceCardId: state.focusSpaceCardId,
    }))
  );
  const {
    editMode,
    setEditMode,
    isUseApplePencil,
    setIsUseApplePencil,
    sketchMode,
    setSketchMode,
    eraserInfo,
    setEraserInfo,
    pencilInfo,
    setPencilInfo,
  } = canvasEditorSettings;

  return (
    <>
      {/** 第一層 */}
      <>
        {/** 文字編輯 */}
        {focusSpaceCardId && (
          <ToolbarItemButton
            isFocused={editMode === "text"}
            onClick={(event) => {
              event.stopPropagation();
              setEditMode("text");
            }}
          >
            <IoDocumentTextOutline />
          </ToolbarItemButton>
        )}
        {/**  Apple Pencil Only */}
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
        {/**  鉛筆 */}
        {focusSpaceCardId && (
          <ToolbarItemButton
            isFocused={editMode === "sketch" && sketchMode === "pencil"}
            onClick={(event) => {
              event.stopPropagation();
              setEditMode("sketch");
              setSketchMode("pencil");
            }}
          >
            <FaPencil />
          </ToolbarItemButton>
        )}
        {/** 橡皮擦 */}
        {focusSpaceCardId && (
          <ToolbarItemButton
            isFocused={editMode === "sketch" && sketchMode === "eraser"}
            onClick={(event) => {
              event.stopPropagation();
              setEditMode("sketch");
              setSketchMode("eraser");
            }}
          >
            <FaEraser />
          </ToolbarItemButton>
        )}
      </>
      {/** 第二層 */}
      <div
        className="absolute right-14 top-1/2 z-50 flex h-fit w-fit -translate-y-1/2 flex-col items-center"
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

function SpaceToolbar(props: SpaceToolbarProps) {
  const { editorRef } = props;
  const { focusSpaceCardId, isFocusLinkDot, focusLinkLine } = useEditorStore(
    useShallow((state) => ({
      focusSpaceCardId: state.focusSpaceCardId,
      isFocusLinkDot: state.draggingLinkData.isFocusLinkDot,
      focusLinkLine: state.focusLinkLine,
    }))
  );

  const changeSetFocusLinkDot = () => {
    useEditorStore.setState({
      draggingLinkData: {
        ...useEditorStore.getState().draggingLinkData,
        isFocusLinkDot: !isFocusLinkDot,
      },
    });
  };

  const mutate = useDeleteSpaceCardLinkCase();

  return (
    <>
      {/** 第一層 */}
      <div className="absolute right-2 top-1/2 z-50 flex h-fit w-fit -translate-y-1/2 flex-col items-center">
        <SpaceToolbarCanvasSetting {...props} />
        {/** 透過 網址生成卡片串 */}
        {!focusSpaceCardId && <ToolbarItemAddSpaceCardByWebButton />}
        {/** 新增題目 */}
        {!focusSpaceCardId && (
          <ToolbarItemAddCardButton editorRef={editorRef} />
        )}
        {/** 鏈結題目 */}
        <ToolbarItemButton
          isFocused={isFocusLinkDot}
          onClick={(event) => {
            event.stopPropagation();
            changeSetFocusLinkDot();
          }}
        >
          <FaLink />
        </ToolbarItemButton>
        {/** 取消位置聚焦 */}
        {/* {isPositionLocked && (
          <ToolbarItemPositionDeLockButton
            isPositionLocked={isPositionLocked}
            setIsPositionLocked={setIsPositionLocked}
          />
        )} */}
        {/** 刪除題目 */}
        {focusSpaceCardId && <ToolbarItemDeleteCardButton />}
        {/** 刪除連結 */}
        {focusLinkLine && <ToolbarItemDeleteLinkButton />}
      </div>
    </>
  );
}

export default SpaceToolbar;
