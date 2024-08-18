import { useEffect } from "react";
import useSocket from "../useSocket";
import { useShallow } from "zustand/react/shallow";
import { SpaceCardDTO } from "@repo/shared-types";
import { useQueryClient } from "@tanstack/react-query";
import useSpaceStore from "@/stores/useSpaceStore";

function useDeleteSpaceCardLinkSocketManagement() {
  const { spaceId, setSpace } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
      setSpace: useSpaceStore.setState,
    }))
  );

  const { socket } = useSocket(spaceId);
  const queryClient = useQueryClient();

  // handler result
  const deleteSpaceCardLink = async (data: SpaceCardDTO) => {
    queryClient.invalidateQueries({
      queryKey: ["space", data.id],
    });
    queryClient.invalidateQueries({
      queryKey: ["spaces"],
    });
    const spaceCards = useSpaceStore.getState().spaceCards;

    setSpace({
      spaceCards: spaceCards.map((sc) =>
        sc.id === data.id
          ? {
              ...sc,
              linkLines: data.linkLines,
            }
          : sc
      ),
    });
  };

  //handler backend event
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(`space:card:link:remove`, (data) => {
      deleteSpaceCardLink(data);
    });
    return () => {
      socket.off(`space:card:link:remove`, deleteSpaceCardLink);
    };
  }, [socket]);
}

export default useDeleteSpaceCardLinkSocketManagement;
