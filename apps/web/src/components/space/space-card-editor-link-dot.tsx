"use client";

import { useRef } from "react";
import useCreateSpaceCardLink from "@/hooks/space/useCreateSpaceCardLinkCase";
import useDragLinkEventCase from "@/hooks/space/useDragLinkEventCase";
import { LinkDotDirection } from "@/models/dragging-link-data";
import useCardsStore from "@/stores/useCardsStore";
import useEditorStore from "@/stores/useEditorStore";
import useSpaceStore from "@/stores/useSpaceStore";
import { cn } from "@/utils/cn";
import getSpaceCardLinkDotPosition from "@/utils/space/get-space-card-link-dot-position";
import renderSvgPath from "@/utils/space/render-svg-path";
import transformMouseClientPositionToViewPosition from "@/utils/space/transformMouseClientPositionToViewPosition";

/**
 * 區塊與區塊的連結點
 */
function LinkDot({
  spaceCardId,
  direction,
}: {
  spaceCardId: string;
  direction: LinkDotDirection;
}) {
  const isFocusLinkDot = useEditorStore(
    (state) => state.draggingLinkData.isFocusLinkDot
  );
  const viewScale = useEditorStore((state) => state.view.scale);
  const spaceId = useSpaceStore((state) => state.id);
  const linkDotRef = useRef<HTMLDivElement>(null);
  const svgBoxRef = useRef<SVGSVGElement>(null);
  const pathLineRef = useRef<SVGPathElement>(null);
  const isDragging = useEditorStore(
    (state) => state.draggingLinkData.fromSpaceCardId === spaceCardId
  );
  const mutateCreateLink = useCreateSpaceCardLink(spaceCardId);

  useDragLinkEventCase({
    spaceCardId,
    linkDotRef,
    direction,
    onDragStart() {
      svgBoxRef.current?.setAttribute("style", "display: block");
    },
    onDragMove(event) {
      const view = useEditorStore.getState().view;
      const spaceCard = useSpaceStore
        .getState()
        .spaceCards.find((sc) => sc.id === spaceCardId);
      const card = useCardsStore
        .getState()
        .cards.find((c) => c.id === spaceCard?.targetCardId);
      if (!card || !spaceCard) {
        return;
      }
      const mouseViewPosition = transformMouseClientPositionToViewPosition(
        view,
        event.clientX,
        event.clientY
      );
      const linkDotPosition = getSpaceCardLinkDotPosition(
        { x: 0, y: 0 },
        card,
        direction
      );
      renderSvgPath(pathLineRef, svgBoxRef, linkDotPosition, {
        x: mouseViewPosition.x - spaceCard.x,
        y: mouseViewPosition.y - spaceCard.y,
      });
    },
    onDragEnd() {
      svgBoxRef.current?.setAttribute("style", "display: none");
    },
    onBeConnected: (dragData) => {
      console.log("onBeConnected", dragData);
      mutateCreateLink.mutate({
        spaceId: spaceId,
        startSpaceCardId: dragData.fromSpaceCardId,
        startSpaceCardDirection: dragData.fromSpaceCardDirection,
        endSpaceCardId: dragData.toSpaceCardId,
        endSpaceCardDirection: dragData.toSpaceCardDirection,
      });
    },
  });

  return (
    <>
      <div
        ref={linkDotRef}
        className={cn(
          "link-dot absolute cursor-pointer rounded-full bg-gray-400 dark:bg-white",
          isDragging && " border-2 border-white",
          direction === "top" && "-top-8 left-1/2 -translate-x-1/2",
          direction === "bottom" && "-bottom-8 left-1/2 -translate-x-1/2",
          direction === "left" && "-left-8 top-1/2 -translate-y-1/2",
          direction === "right" && "-right-8 top-1/2 -translate-y-1/2"
        )}
        style={{
          width: `${12 / viewScale}px`,
          height: `${12 / viewScale}px`,
          display: isFocusLinkDot ? "block" : "none",
        }}
      ></div>

      {/** 建立連結時的預覽線 */}
      {isDragging && (
        <svg
          ref={svgBoxRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <path
            ref={pathLineRef}
            radius={128}
            stroke="white"
            strokeWidth="3"
            fill="transparent"
          />
        </svg>
      )}
    </>
  );
}

export default LinkDot;
