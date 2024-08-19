"use client";

import React, { useCallback } from "react";
import {
  MdAddToPhotos,
  MdOutlineVerticalAlignTop,
  MdOutlineVerticalAlignBottom,
  MdArrowUpward,
  MdArrowDownward,
  MdDelete,
} from "react-icons/md";
import { SlSizeActual } from "react-icons/sl";
import { useShallow } from "zustand/react/shallow";
import { SpaceCardUpdateLayerRequestDTO } from "@repo/shared-types";
import { Listbox, ListboxSection, ListboxItem } from "@/components/nextui";
import useCreateCard from "@/hooks/card/useCreateCard";
import useCloseContextMenuCase from "@/hooks/space/useCloseContextMenuCase";
import useCreateSpaceCardCase from "@/hooks/space/useCreateSpaceCardCase";
import useDeleteSpaceCardCase from "@/hooks/space/useDeleteSpaceCardCase";
import useUpdateSpaceCardLayerCase from "@/hooks/space/useUpdateSpaceCardLayerCase";
import useEditorStore from "@/stores/useEditorStore";
import useSpaceStore from "@/stores/useSpaceStore";
import transformMouseClientPositionToViewPosition from "@/utils/space/transformMouseClientPositionToViewPosition";

export interface ContextMenuInfo {
  x: number;
  y: number;
  targetSpaceCardId?: string;
}

// global space context menu
function GlobalSpaceContextMenu(): React.ReactNode {
  const { spaceId } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
    }))
  );

  const closeContextMenu = useCloseContextMenuCase();
  const mutateCreateCard = useCreateCard();
  const mutateCreateSpaceCard = useCreateSpaceCardCase();

  const handleAddCard = useCallback(() => {
    mutateCreateCard.mutate(undefined, {
      onSuccess: (data) => {
        console.log("新增卡片成功", data.data);
        const { view, contextMenuInfo } = useEditorStore.getState();
        mutateCreateSpaceCard.mutate(
          {
            spaceId,
            targetCardId: data.data.card.id,
            ...transformMouseClientPositionToViewPosition(
              view,
              contextMenuInfo?.x || 0,
              contextMenuInfo?.y || 0
            ),
          },
          {
            onSuccess: () => {
              closeContextMenu();
            },
          }
        );
      },
      onError: (error) => {
        console.error("新增卡片失敗", error);
      },
    });
  }, [mutateCreateCard, mutateCreateSpaceCard, spaceId]);

  return (
    <>
      <Listbox aria-label="空間選單">
        <ListboxSection title="操作">
          <ListboxItem
            key="add-card"
            description="新增一張空白卡片"
            startContent={<MdAddToPhotos />}
            onClick={handleAddCard}
          >
            新增卡片
          </ListboxItem>
        </ListboxSection>
      </Listbox>
    </>
  );
}

// space card context menu
function SpaceCardContextMenu(): React.ReactNode {
  const spaceId = useSpaceStore((state) => state.id);
  const mutateDeleteSpaceCard = useDeleteSpaceCardCase();
  const mutateUpdateSpaceCardLayer = useUpdateSpaceCardLayerCase();
  const contextMenuInfo = useEditorStore((state) => state.contextMenuInfo);
  const closeContextMenu = useCloseContextMenuCase();
  const layerOptions: {
    label: string;
    description: string;
    icon: React.ReactNode;
    value: SpaceCardUpdateLayerRequestDTO["operation"];
  }[] = [
    {
      label: "置頂",
      description: "將卡片置頂",
      icon: <MdOutlineVerticalAlignTop />,
      value: "top",
    },
    {
      label: "置底",
      description: "將卡片置底",
      icon: <MdOutlineVerticalAlignBottom />,
      value: "bottom",
    },
    {
      label: "上移一層",
      description: "將卡片上移一層",
      icon: <MdArrowUpward />,
      value: "up",
    },
    {
      label: "下移一層",
      description: "將卡片下移一層",
      icon: <MdArrowDownward />,
      value: "down",
    },
  ];

  return (
    <Listbox aria-label="卡片選單">
      <ListboxSection title="順序" showDivider>
        {layerOptions.map((layerOption) => (
          <ListboxItem
            key={layerOption.value}
            description={layerOption.description}
            startContent={layerOption.icon}
            onClick={() => {
              if (!contextMenuInfo?.targetSpaceCardId) return;
              mutateUpdateSpaceCardLayer.mutate({
                spaceId,
                spaceCardId: contextMenuInfo.targetSpaceCardId,
                operation: layerOption.value,
              });
              closeContextMenu();
            }}
          >
            {layerOption.label}
          </ListboxItem>
        ))}
      </ListboxSection>
      <ListboxSection title="操作">
        <ListboxItem
          key={"fit-content"}
          description="將卡片大小調整至與文字內容相同的大小"
          startContent={<SlSizeActual />}
          onClick={() => {
            const event = new CustomEvent("space-card-fit-content", {
              detail: {
                spaceCardId: contextMenuInfo?.targetSpaceCardId,
              },
            });
            window.dispatchEvent(event);
          }}
        >
          大小適應
        </ListboxItem>
        <ListboxItem
          key={"delete-card"}
          description="從本空間中刪除卡片"
          startContent={<MdDelete />}
          onClick={async () => {
            if (!contextMenuInfo?.targetSpaceCardId) return;
            await mutateDeleteSpaceCard.mutateAsync({
              spaceId,
              spaceCardId: contextMenuInfo.targetSpaceCardId,
            });
            closeContextMenu();
          }}
        >
          刪除卡片
        </ListboxItem>
      </ListboxSection>
    </Listbox>
  );
}

// contextMenu: 右鍵選單
const ContextMenuComponent = React.forwardRef(({}, ref) => {
  const contextMenuInfo = useEditorStore((state) => state.contextMenuInfo);
  return (
    <div
      className={`absolute flex h-fit w-fit min-w-48 flex-col gap-2 rounded-md bg-gray-800 p-1 text-gray-100 ${
        contextMenuInfo ? "" : "hidden"
      }`}
      style={{
        left: contextMenuInfo ? contextMenuInfo.x : 0,
        top: contextMenuInfo ? contextMenuInfo.y : 0,
      }}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      {contextMenuInfo?.targetSpaceCardId && <SpaceCardContextMenu />}
      {!contextMenuInfo?.targetSpaceCardId && <GlobalSpaceContextMenu />}
    </div>
  );
});

export default ContextMenuComponent;
