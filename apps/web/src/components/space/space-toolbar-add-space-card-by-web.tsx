"use client";

import { useState } from "react";
import { FaEarthAsia } from "react-icons/fa6";
import { toast } from "sonner";
import { fetchCreateSpaceCardByWeb } from "@/hooks/space/useCreateSpaceCardByWeb";
import useSpaceStore from "@/stores/useSpaceStore";
import ToolbarItemButton from "./space-toolbar-item-button";

export default function ToolbarItemAddSpaceCardByWebButton() {
  const spaceId = useSpaceStore((state) => state.id);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSpaceCard = async (url: string) => {
    setIsGenerating(true);
    fetchCreateSpaceCardByWeb({
      spaceId,
      url,
    });

    setIsGenerating(false);
  };

  return (
    <>
      <ToolbarItemButton
        isFocused={false}
        className={
          isGenerating
            ? " pointer-events-none relative cursor-not-allowed opacity-50"
            : " relative"
        }
        onClick={() => {
          const url = window.prompt("你可以輸入網址，Ziphus 會自動將其轉化成卡片串（實驗性功能）");
          if (url) {
            handleGenerateSpaceCard(url);
          }
        }}
      >
        <FaEarthAsia />
      </ToolbarItemButton>
    </>
  );
}
