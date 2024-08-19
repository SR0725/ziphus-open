"use client";

import { useState } from "react";
import { MdPictureAsPdf } from "react-icons/md";
import { toast } from "sonner";
import { fetchCreateSpaceCardByPdf } from "@/hooks/space/useCreateSpaceCardByPdf";
import useSpaceStore from "@/stores/useSpaceStore";
import ToolbarItemButton from "./space-toolbar-item-button";

export default function ToolbarItemAddSpaceCardByPdfButton() {
  const spaceId = useSpaceStore((state) => state.id);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSpaceCard = async (data: File) => {
    setIsGenerating(true);
    fetchCreateSpaceCardByPdf({
      spaceId,
      pdfFile: data,
    });

    setIsGenerating(false);
    toast.success("知識生成成功");
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
      >
        <MdPictureAsPdf />

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            // 最大 50 MB
            if (file.size > 50 * 1024 * 1024) {
              toast.error("目前檔案最大不得超過 50MB");
              return;
            }
            handleGenerateSpaceCard(file);
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </ToolbarItemButton>
    </>
  );
}
