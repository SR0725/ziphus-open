"use client";

import { useCallback, useEffect, useRef } from "react";
import useGetCard from "../../hooks/card/useGetCard";
import { SpaceCardDTO } from "@repo/shared-types";
import useGetSpaceCard from "@/hooks/space/useGetSpaceCard";
import useLinkFocus from "@/hooks/space/useLinkFocus";
import useThemeProvider from "@/hooks/useThemeProvider";
import { THEME_TYPES } from "@/models/theme-type";
import useCardsStore from "@/stores/useCardsStore";
import useEditorStore from "@/stores/useEditorStore";
import useSpaceStore from "@/stores/useSpaceStore";
import getSpaceCardLinkDotPosition from "@/utils/space/get-space-card-link-dot-position";
import renderSvgPath from "@/utils/space/render-svg-path";

/**
 * 顯示區塊與區塊的已建立連結線
 */
function LinkPath({ linkLine }: { linkLine: SpaceCardDTO["linkLines"][0] }) {
  const svgBoxRef = useRef<SVGSVGElement>(null);
  const pathLineRef = useRef<SVGPathElement>(null);
  const getSpaceCard = useGetSpaceCard();
  const getCard = useGetCard();
  const { handleFocusLink } = useLinkFocus();
  const isFocus = useEditorStore(
    (state) => state.focusLinkLine?.linkLineId === linkLine.id
  );

  useEffect(() => {
    useSpaceStore.subscribe((state, oldState) => {
      handleRenderPath();
    });
    useCardsStore.subscribe((state, oldState) => {
      handleRenderPath();
    });
    setTimeout(() => {
      handleRenderPath();
    }, 10);
  }, []);

  const handleRenderPath = useCallback(() => {
    const startSpaceCard = getSpaceCard(linkLine.startCardId);
    const endSpaceCard = getSpaceCard(linkLine.endCardId);
    if (!startSpaceCard || !endSpaceCard) {
      return;
    }
    const startCard = getCard(startSpaceCard.targetCardId);
    const endCard = getCard(endSpaceCard.targetCardId);
    if (!startCard || !endCard) {
      return;
    }

    // 將座標轉換為相對於空間卡片的座標系統(讓 0, 0 剛好會是空間卡片的左上角)
    // (因為 LinkPath 會放在 SpaceCard 底下)
    const startLinkDotPosition = getSpaceCardLinkDotPosition(
      { x: 0, y: 0 },
      startCard,
      linkLine.startCardDirection
    );
    const endLinkDotPositionWithOffset = getSpaceCardLinkDotPosition(
      endSpaceCard,
      endCard,
      linkLine.endCardDirection
    );
    const endLinkDotPosition = {
      x: endLinkDotPositionWithOffset.x - startSpaceCard.x,
      y: endLinkDotPositionWithOffset.y - startSpaceCard.y,
    };
    renderSvgPath(
      pathLineRef,
      svgBoxRef,
      startLinkDotPosition,
      endLinkDotPosition
    );
  }, [linkLine]);
  const { theme } = useThemeProvider();

  return (
    <svg
      ref={svgBoxRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
      id={linkLine.id}
    >
      <defs>
        <marker
          id={`arrowhead-${linkLine.id}`}
          viewBox="0 0 10 10"
          refX="10"
          refY="6"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
          stroke={
            isFocus
              ? "red"
              : theme === THEME_TYPES.THEME_LIGHT
                ? "gray"
                : "white"
          }
          fill={
            isFocus
              ? "red"
              : theme === THEME_TYPES.THEME_LIGHT
                ? "gray"
                : "white"
          }
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <path
        ref={pathLineRef}
        className=" cursor-pointer"
        radius={128}
        stroke={
          isFocus ? "red" : theme === THEME_TYPES.THEME_LIGHT ? "gray" : "white"
        }
        strokeWidth="4"
        markerEnd={`url(#arrowhead-${linkLine.id})`}
        fill="none"
        style={{
          cursor: "pointer",
          pointerEvents: "auto",
        }}
        onClick={(e) => {
          handleFocusLink(linkLine);
          e.stopPropagation();
        }}
      />
    </svg>
  );
}

export default LinkPath;
