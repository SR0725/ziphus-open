"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import useGetCard from "../../hooks/card/useGetCard";
import { CardGetByIdResponseDTO } from "@repo/shared-types";
import useCardResizeEvent from "@/hooks/card/useCardResizeEvent";
import useCardSizeUpdate from "@/hooks/card/useCardSizeUpdate";
import useCardStoreInitialCase from "@/hooks/card/useCardStoreInitialCase";
import useFitContentEvent from "@/hooks/card/useFitContentEvent";
import useQueryCardById from "@/hooks/card/useQueryCardById";
import useUpdateCardIsSizeFitContentCase from "@/hooks/card/useUpdateCardIsSizeFitContentCase";
import useUpdateCardSizeCase from "@/hooks/card/useUpdateCardSizeCase";
import useCanvasEditor from "@/hooks/useCanvasEditor";
import useMe from "@/hooks/useMe";
import useYJSProvide from "@/hooks/useYJSProvider";
import { cn } from "@/utils/cn";
import CardEditorSketchPanel from "./card-editor-sketch-panel";

const CardEditorMarkdownEditor = dynamic(
  () => import("./card-editor-markdown-editor")
);

export const MIN_CONTENT_CARD_HEIGHT = 128;
export const MIN_CONTENT_CARD_WIDTH = 600;

interface IndependentCardEditorProps {
  initialCard: CardGetByIdResponseDTO["card"];
  cardId: string;
}

export function IndependentCardEditor(props: IndependentCardEditorProps) {
  const canvasEditorSettings = useCanvasEditor();

  return (
    <CardEditorPreviewer
      {...props}
      isEditable={true}
      canvasEditorSettings={canvasEditorSettings}
    />
  );
}

interface CardEditorProps {
  initialCard: CardGetByIdResponseDTO["card"];
  cardId: string;
  isEditable: boolean;
  spaceCardId?: string;
  canvasEditorSettings: ReturnType<typeof useCanvasEditor>;
  alwaysFullWidth?: boolean;
}

export function CardEditorPreviewer(props: CardEditorProps) {
  const { initialCard, cardId } = props;
  const { card: fetchedCard } = useQueryCardById(cardId);
  if (!initialCard && !fetchedCard) return <div>Loading...</div>;

  return (
    <CardEditorContentPreviewer
      {...props}
      initialCard={initialCard || fetchedCard}
    />
  );
}

function CardEditorContentPreviewer(props: CardEditorProps) {
  const {
    initialCard,
    canvasEditorSettings,
    spaceCardId,
    isEditable,
    alwaysFullWidth,
  } = props;
  if (!initialCard) throw new Error("Card not found");

  // 紀錄文本編輯器的高度
  const contentHeightRef = useRef<number>(0);
  // 初始化所需資料
  const initialCardStore = useCardStoreInitialCase();
  const getCard = useGetCard();
  useEffect(() => {
    if (getCard(initialCard.id)) return;
    initialCardStore(initialCard);
    contentHeightRef.current = initialCard.height;
  }, [initialCard]);
  const { account } = useMe();
  const { doc, provider, status } = useYJSProvide(`card:${initialCard.id}`);

  const cardHTMLElementRef = useRef<HTMLDivElement>(null);

  const { handleUpdateCardSize, handleUpdateCardSizeFinish } =
    useUpdateCardSizeCase(initialCard.id);

  const mutateUpdateCardIsSizeFitContent = useUpdateCardIsSizeFitContentCase(
    initialCard.id
  );

  // 創建事件:卡片大小拖動邊界
  const { widthBorderHandleRef, heightBorderHandleRef, cornerBorderHandleRef } =
    useCardResizeEvent(true, initialCard.id, handleUpdateCardSize, async () => {
      await mutateUpdateCardIsSizeFitContent.mutateAsync({
        cardId: initialCard.id,
        isSizeFitContent: false,
      });
      handleUpdateCardSizeFinish();
    });

  // 創建事件:更新卡片大小為適應內容
  useFitContentEvent(spaceCardId, async () => {
    const newHeight =
      contentHeightRef.current < MIN_CONTENT_CARD_HEIGHT
        ? MIN_CONTENT_CARD_HEIGHT
        : contentHeightRef.current;
    await mutateUpdateCardIsSizeFitContent.mutateAsync({
      cardId: initialCard.id,
      isSizeFitContent: true,
    });
    handleUpdateCardSize({
      width: MIN_CONTENT_CARD_WIDTH,
      height: newHeight,
    });
    handleUpdateCardSizeFinish();
  });

  // 更新卡片大小
  useCardSizeUpdate(cardHTMLElementRef, initialCard.id, alwaysFullWidth);

  // 當文本編輯器的高度因為輸入文字改變時，更新卡片大小
  const onContentSizeChange = useCallback((height: number) => {
    const card = getCard(initialCard.id);
    if (!card) return;
    if (!card.isSizeFitContent) return;
    if (height === contentHeightRef.current || contentHeightRef.current === 0) {
      contentHeightRef.current = height;
      return;
    }
    contentHeightRef.current = height;
    handleUpdateCardSize({
      width: card.width,
      height:
        height < MIN_CONTENT_CARD_HEIGHT ? MIN_CONTENT_CARD_HEIGHT : height,
    });
    handleUpdateCardSizeFinish();
  }, []);

  return (
    <div
      className={cn("card-container relative overflow-hidden")}
      ref={cardHTMLElementRef}
    >
      {/** 卡片內容 */}
      {provider ? (
        <div>
          <CardEditorSketchPanel
            cardId={initialCard.id}
            accountName={account?.name ?? "匿名貓貓"}
            doc={doc}
            isActive={canvasEditorSettings.editMode === "sketch"}
            {...canvasEditorSettings}
          />
          <CardEditorMarkdownEditor
            cardId={initialCard.id}
            onContentSizeChange={onContentSizeChange}
            accountName={account?.name ?? "匿名貓貓"}
            provider={provider}
            doc={doc}
            editable={isEditable}
          />
        </div>
      ) : (
        <div className=" p-8 text-white">與伺服器連線中...</div>
      )}
      {/** 連線狀況指示器 */}
      {status !== "connected" && (
        <div className="pointer-events-none absolute right-2 top-2 text-gray-700 opacity-60 dark:text-white">
          {status === "disconnected" ? "連線中斷" : "連線中..."}
        </div>
      )}
      {/** 大小拖動邊界 */}
      {isEditable && (
        <>
          <div
            ref={widthBorderHandleRef}
            className="absolute right-0 top-0 flex h-[calc(100%-0.5rem)] w-2 cursor-ew-resize items-center"
          >
            <div className="h-8 w-full rounded-full bg-slate-100"></div>
          </div>
          <div
            ref={heightBorderHandleRef}
            className="absolute bottom-0 left-0 h-2 w-[calc(100%-0.5rem)] cursor-ns-resize"
          >
            <div className="mx-auto h-full w-8 rounded-full bg-slate-100"></div>
          </div>
          <div
            ref={cornerBorderHandleRef}
            className="absolute bottom-0 right-0 h-2 w-2 cursor-nwse-resize"
          />
        </>
      )}
    </div>
  );
}
