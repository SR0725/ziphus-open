"use client";

import { useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { CardDto, CardGetByIdResponseDTO } from "@repo/shared-types";
import useCardResize from "@/hooks/card/useCardResize";
import useFitContentEvent from "@/hooks/card/useFitContentEvent";
import useQueryCardById from "@/hooks/card/useQueryCardById";
import useUpdateCardIsSizeFitContent from "@/hooks/card/useUpdateCardIsSizeFitContent";
import useUpdateCardSize from "@/hooks/card/useUpdateCardSize";
import useViewScaleUpdate from "@/hooks/card/useViewScaleUpdate";
import useCanvasEditor from "@/hooks/useCanvasEditor";
import useMe from "@/hooks/useMe";
import useYJSProvide from "@/hooks/useYJSProvider";
import { cn } from "@/utils/cn";
import CardEditorSketchPanel, {
  EditMode,
  EraserInfo,
  PencilInfo,
  SketchMode,
} from "./card-editor-sketch-panel";

const CardEditorMarkdownEditor = dynamic(
  () => import("./card-editor-markdown-editor")
);

export const MIN_CONTENT_CARD_HEIGHT = 800;
export const MIN_CONTENT_CARD_WIDTH = 600;

interface IndependentCardEditorProps {
  initialCard: CardGetByIdResponseDTO["card"];
  cardId: string;
}

export function IndependentCardEditor(props: IndependentCardEditorProps) {
  const { editMode, sketchMode, pencilInfo, eraserInfo, isUseApplePencil } =
    useCanvasEditor();

  return (
    <CardEditorSEO
      {...props}
      isFocus={true}
      isEditable={true}
      isUseApplePencil={isUseApplePencil}
      editMode={editMode}
      sketchMode={sketchMode}
      pencilInfo={pencilInfo}
      eraserInfo={eraserInfo}
    />
  );
}

interface CardEditorProps {
  initialCard: CardGetByIdResponseDTO["card"];
  cardId: string;
  isFocus: boolean;
  isUseApplePencil: boolean;
  isEditable: boolean;
  editMode: EditMode;
  sketchMode: SketchMode;
  pencilInfo: PencilInfo;
  eraserInfo: EraserInfo;
  spaceCardId?: string;
}

export function CardEditorSEO(props: CardEditorProps) {
  const { initialCard, cardId } = props;
  const { card: fetchedCard } = useQueryCardById(cardId);

  if (!initialCard && !fetchedCard) return <div>Loading...</div>;

  if (initialCard && !fetchedCard)
    return (
      <div
        className="text-white"
        dangerouslySetInnerHTML={{
          __html: initialCard.content as string,
        }}
      ></div>
    );

  return <CardEditor {...props} initialCard={initialCard || fetchedCard} />;
}

function CardEditor({
  initialCard,
  isFocus,
  isEditable,
  isUseApplePencil,
  editMode,
  sketchMode,
  pencilInfo,
  eraserInfo,
  spaceCardId,
}: CardEditorProps) {
  if (!initialCard) throw new Error("Card not found");

  const cardDataRef = useRef<CardDto>(initialCard);
  const cardHTMLElementRef = useRef<HTMLDivElement>(null);
  const contentHeightRef = useRef<number>(0);
  const { account } = useMe();
  const { doc, provider, status } = useYJSProvide(`card:${initialCard?.id}`);

  const { needRefresh } = useViewScaleUpdate(cardHTMLElementRef, cardDataRef);

  const mutateUpdateCardSize = useUpdateCardSize(
    initialCard.id,
    (width, height) => {
      cardDataRef.current.width = width;
      cardDataRef.current.height = height;
      needRefresh();
    }
  );
  const mutateUpdateCardIsSizeFitContent = useUpdateCardIsSizeFitContent(
    initialCard.id,
    (isSizeFitContent) => {
      cardDataRef.current.isSizeFitContent = isSizeFitContent;
    }
  );

  const onContentSizeChange = useCallback((height: number) => {
    contentHeightRef.current = height;
    if (!cardDataRef.current.isSizeFitContent) {
      return;
    }

    mutateUpdateCardSize.mutate({
      height:
        height < MIN_CONTENT_CARD_HEIGHT ? MIN_CONTENT_CARD_HEIGHT : height,
      width: cardDataRef.current.width,
    });
  }, []);

  const onCardSizeChange = useCallback(
    (width: number, height: number) => {
      cardDataRef.current.width = width;
      cardDataRef.current.height = height;
      needRefresh();
      if (cardDataRef.current.isSizeFitContent) {
        mutateUpdateCardIsSizeFitContent.mutate({
          isSizeFitContent: false,
        });
      }
    },
    [needRefresh]
  );

  const onCardSizeChangeFinish = useCallback(
    (width: number, height: number) => {
      mutateUpdateCardSize.mutate({
        width,
        height,
      });
    },
    [mutateUpdateCardSize]
  );

  const { widthBorderHandleRef, heightBorderHandleRef, cornerBorderHandleRef } =
    useCardResize(
      isFocus,
      cardDataRef,
      onCardSizeChange,
      onCardSizeChangeFinish
    );

  useFitContentEvent(spaceCardId, () => {
    mutateUpdateCardIsSizeFitContent.mutate({
      isSizeFitContent: true,
    });
    const newHeight =
      contentHeightRef.current < MIN_CONTENT_CARD_HEIGHT
        ? MIN_CONTENT_CARD_HEIGHT
        : contentHeightRef.current;
    onCardSizeChange(MIN_CONTENT_CARD_WIDTH, newHeight);
    onCardSizeChangeFinish(MIN_CONTENT_CARD_WIDTH, newHeight);
  });

  return (
    <div
      className="card-container relative overflow-hidden"
      ref={cardHTMLElementRef}
    >
      {status === "connected" && provider ? (
        <div
          className={cn(
            isFocus ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <CardEditorSketchPanel
            isSketching={editMode === "sketch"}
            cardId={cardDataRef.current.id}
            accountName={account?.name ?? "匿名貓貓"}
            doc={doc}
            isUseApplePencil={isUseApplePencil}
            sketchMode={sketchMode}
            pencilInfo={pencilInfo}
            eraserInfo={eraserInfo}
          />
          <CardEditorMarkdownEditor
            cardId={cardDataRef.current.id}
            onContentSizeChange={onContentSizeChange}
            accountName={account?.name ?? "匿名貓貓"}
            provider={provider}
            doc={doc}
          />
        </div>
      ) : (
        <div className=" p-8 text-white">與伺服器連線中...</div>
      )}
      {isFocus && (
        <>
          <div
            ref={widthBorderHandleRef}
            className="absolute right-0 top-0 h-[calc(100%-0.5rem)] w-2 cursor-ew-resize"
          />
          <div
            ref={heightBorderHandleRef}
            className="absolute bottom-0 left-0 h-2 w-[calc(100%-0.5rem)] cursor-ns-resize"
          />
          <div
            ref={cornerBorderHandleRef}
            className="absolute bottom-0 right-0 h-2 w-2 cursor-nwse-resize"
          />
        </>
      )}
    </div>
  );
}

export default CardEditor;
