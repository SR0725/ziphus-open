import { useEffect } from "react";
import useSocket from "../useSocket";
import { useShallow } from "zustand/react/shallow";
import { useQueryClient } from "@tanstack/react-query";
import useCardsStore from "@/stores/useCardsStore";
import useSpaceStore from "@/stores/useSpaceStore";

export interface UpdateCardSizeData {
  cardId: string;
  width: number;
  height: number;
}

function useUpdateCardSizeSocketManagement() {
  const { spaceId } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
    }))
  );
  const setCard = useCardsStore((state) => state.setCard);

  const { socket } = useSocket(spaceId);
  const queryClient = useQueryClient();

  // handler result
  const handleCardSizeChange = (data: UpdateCardSizeData) => {
    setCard({
      id: data.cardId,
      width: data.width,
      height: data.height,
    });
    queryClient.invalidateQueries({ queryKey: ["cards", data.cardId] });
    queryClient.invalidateQueries({ queryKey: ["cards"] });
  };

  // handler backend event
  useEffect(() => {
    socket?.on(`card:size-modified`, (data: UpdateCardSizeData) => {
      handleCardSizeChange(data);
    });

    return () => {
      socket?.off(`card:size-modified`);
    };
  }, [socket]);
}

export default useUpdateCardSizeSocketManagement;
