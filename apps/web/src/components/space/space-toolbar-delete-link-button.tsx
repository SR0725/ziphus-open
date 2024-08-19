"use client";

import { FaLinkSlash } from "react-icons/fa6";
import { useShallow } from "zustand/react/shallow";
import useDeleteSpaceCardLinkCase from "@/hooks/space/useDeleteSpaceCardLinkCase";
import useEditorStore from "@/stores/useEditorStore";
import useSpaceStore from "@/stores/useSpaceStore";
import ToolbarItemButton from "./space-toolbar-item-button";

export default function ToolbarItemDeleteLinkButton() {
  const spaceId = useSpaceStore((state) => state.id);
  const { focusLinkLine } = useEditorStore(
    useShallow((state) => ({
      focusLinkLine: state.focusLinkLine,
    }))
  );

  const unFocusLink = () => {
    useEditorStore.setState({
      focusLinkLine: null,
    });
  };
  const mutate = useDeleteSpaceCardLinkCase();
  return (
    <>
      <ToolbarItemButton
        isFocused={Boolean(focusLinkLine)}
        className=" bg-red-500"
        onClick={(event) => {
          if (!focusLinkLine) return;
          event.stopPropagation();
          mutate.mutate({
            targetSpaceCardId: focusLinkLine.spaceCardId,
            linkLineId: focusLinkLine.linkLineId,
            spaceId: spaceId,
          });
          unFocusLink();
        }}
      >
        <FaLinkSlash />
      </ToolbarItemButton>
    </>
  );
}
