"use client";

import { useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import useDeleteSpaceCard from "@/hooks/space/useDeleteSpaceCardCase";
import useEditorStore from "@/stores/useEditorStore";
import useSpaceStore from "@/stores/useSpaceStore";
import { cn } from "@/utils/cn";
import ToolbarItemButton from "./space-toolbar-item-button";

export default function ToolbarItemDeleteCardButton() {
  const spaceId = useSpaceStore((state) => state.id);
  const { focusSpaceCardId } = useEditorStore(
    useShallow((state) => ({
      focusSpaceCardId: state.focusSpaceCardId,
    }))
  );

  const mutateDeleteSpaceCard = useDeleteSpaceCard();

  const [tryDeleteCard, setTryDeleteCard] = useState(false);
  return (
    <>
      <div className=" relative">
        <ToolbarItemButton
          className={cn(tryDeleteCard ? "bg-red-900" : "bg-red-500")}
          isFocused={true}
          onClick={(event) => {
            event.stopPropagation();
            if (!tryDeleteCard) {
              setTryDeleteCard(true);
            } else {
              mutateDeleteSpaceCard.mutate({
                spaceId: spaceId,
                spaceCardId: focusSpaceCardId!,
              });
            }
          }}
        >
          <IoTrashBinOutline />
        </ToolbarItemButton>
        {tryDeleteCard && (
          <div className=" pointer-events-none absolute right-14 top-0 h-fit w-64 rounded bg-red-700 px-2 py-1 translate-y-1/4 text-white">
            <p>再點一次以確定刪除該卡片</p>
          </div>
        )}
      </div>
    </>
  );
}
