import { useCallback, useEffect } from "react";
import useSocket from "../useSocket";
import { useShallow } from "zustand/react/shallow";
import { SpaceCardDTO } from "@repo/shared-types";
import { useQueryClient } from "@tanstack/react-query";
import useSpaceStore from "@/stores/useSpaceStore";
import delay from "@/utils/delay";
import { toast } from "sonner";

function useCreateSpaceCardByPdfCaseSocketManagement() {
  const { spaceId, setSpace } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
      setSpace: useSpaceStore.setState,
    }))
  );

  const { socket } = useSocket(spaceId);
  const queryClient = useQueryClient();

  // handler result
  const createSpaceCardList = useCallback(
    async (data: { spaceCards: SpaceCardDTO[] }) => {
      // invalidate space query cache
      queryClient.invalidateQueries({
        queryKey: ["space", spaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
      });
      for (let i = 0; i < data.spaceCards.length; i++) {
        toast.success(`卡片生成成功 ${i + 1}/${data.spaceCards.length}`);
        const spaceCards = useSpaceStore.getState().spaceCards;
        const spaceCard = data.spaceCards[i]!;

        setSpace({
          spaceCards: [...spaceCards, spaceCard],
        });
        if (i % 20 === 0) {
          await delay(1000);
        }
      }
    },
    [queryClient, setSpace, spaceId]
  );

  // handler backend event
  useEffect(() => {
    socket?.on(
      "space:card:list:create",
      (data: { spaceCards: SpaceCardDTO[] }) => {
        createSpaceCardList(data);
      }
    );

    return () => {
      socket?.off("space:card:list:create");
    };
  }, [createSpaceCardList, socket]);
}

export default useCreateSpaceCardByPdfCaseSocketManagement;
