import { useCallback, useEffect } from "react";
import useSocket from "../useSocket";
import { useShallow } from "zustand/react/shallow";
import { SpaceCardCreateResponseDTO, SpaceCardDTO } from "@repo/shared-types";
import { useQueryClient } from "@tanstack/react-query";
import useSpaceStore from "@/stores/useSpaceStore";

function useCreateSpaceCardCaseSocketManagement() {
  const { spaceId, setSpace } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
      setSpace: useSpaceStore.setState,
    }))
  );

  const { socket } = useSocket(spaceId);
  const queryClient = useQueryClient();

  // handler result
  const createSpaceCard = useCallback(
    async (data: SpaceCardCreateResponseDTO) => {
      const spaceCards = useSpaceStore.getState().spaceCards;
      // invalidate space query cache
      queryClient.invalidateQueries({
        queryKey: ["space", spaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
      });
      // update local space
      if (spaceCards.some((card) => card.id === data.spaceCard.id)) return;
      setSpace({
        spaceCards: [...spaceCards, data.spaceCard],
      });
    },
    [queryClient, setSpace, spaceId]
  );

  // handler backend event
  useEffect(() => {
    socket?.on("space:card:create", (data: SpaceCardCreateResponseDTO) => {
      createSpaceCard(data);
    });

    return () => {
      socket?.off("space:card:create");
    };
  }, [createSpaceCard, socket]);
}

export default useCreateSpaceCardCaseSocketManagement;
