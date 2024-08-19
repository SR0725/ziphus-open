import { useCallback, useEffect } from "react";
import useSocket from "../useSocket";
import { useShallow } from "zustand/react/shallow";
import { useQueryClient } from "@tanstack/react-query";
import useEditorStore from "@/stores/useEditorStore";
import useSpaceStore from "@/stores/useSpaceStore";

function useDeleteSpaceCardSocketManagement() {
  const { spaceId, setSpace } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
      setSpace: useSpaceStore.setState,
    }))
  );
  const { setEditorState } = useEditorStore(
    useShallow((state) => ({
      setEditorState: useEditorStore.setState,
    }))
  );

  const { socket } = useSocket(spaceId);
  const queryClient = useQueryClient();

  // handler result
  const removeSpaceCard = useCallback(
    async (spaceCardId: string) => {
      const spaceCards = useSpaceStore.getState().spaceCards;
      const selectedSpaceCardIdList =
        useEditorStore.getState().selectedSpaceCardIdList;
      const focusSpaceCardId = useEditorStore.getState().focusSpaceCardId;
      // invalidate space query cache
      queryClient.invalidateQueries({
        queryKey: ["space", spaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
      });
      // update local space
      setSpace({
        spaceCards: spaceCards.filter((card) => card.id !== spaceCardId),
      });
      setEditorState({
        focusSpaceCardId:
          focusSpaceCardId === spaceCardId ? null : focusSpaceCardId,
        selectedSpaceCardIdList: selectedSpaceCardIdList.filter(
          (id) => id !== spaceCardId
        ),
      });
    },
    [queryClient, setEditorState, setSpace, spaceId]
  );
  // handler backend event
  useEffect(() => {
    socket?.on("space:card:delete", (data: { spaceCardId: string }) => {
      removeSpaceCard(data.spaceCardId);
    });

    return () => {
      socket?.off("space:card:delete");
    };
  }, [removeSpaceCard]);
}

export default useDeleteSpaceCardSocketManagement;
