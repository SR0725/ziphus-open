"use client";

import { useShallow } from "zustand/react/shallow";
import useSpaceStore from "@/stores/useSpaceStore";
import LinkDot from "./space-card-editor-link-dot";
import LinkPath from "./space-card-editor-link-path";

interface SpaceCardEditorLinkManagerProps {
  spaceCardId: string;
}

function SpaceCardEditorLinkManager({
  spaceCardId,
}: SpaceCardEditorLinkManagerProps) {
  const { linkLines } = useSpaceStore(
    useShallow((state) => ({
      linkLines: state.spaceCards.find((sc) => sc.id === spaceCardId)
        ?.linkLines,
    }))
  );

  return (
    <>
      <>
        <LinkDot spaceCardId={spaceCardId} direction="top" />
        <LinkDot spaceCardId={spaceCardId} direction="right" />
        <LinkDot spaceCardId={spaceCardId} direction="bottom" />
        <LinkDot spaceCardId={spaceCardId} direction="left" />
      </>
      {// 連結線
      linkLines?.map((linkLine) => (
        <LinkPath key={linkLine.id} linkLine={linkLine} />
      ))}
    </>
  );
}

export default SpaceCardEditorLinkManager;
