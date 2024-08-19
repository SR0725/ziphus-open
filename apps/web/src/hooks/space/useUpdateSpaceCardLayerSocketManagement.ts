import { useCallback, useEffect } from "react";
import useSocket from "../useSocket";
import { useShallow } from "zustand/react/shallow";
import { SpaceCardUpdateLayerResponseDTO } from "@repo/shared-types";
import { useQueryClient } from "@tanstack/react-query";
import useSpaceStore from "@/stores/useSpaceStore";


function useUpdateSpaceCardLayerSocketManagement() {
  const { spaceId, setSpace } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
      setSpace: useSpaceStore.setState,
    }))
  );

  const { socket } = useSocket(spaceId);
  const queryClient = useQueryClient();

  // handler result
  const updateSpaceCardLayer = useCallback(
    async (data: SpaceCardUpdateLayerResponseDTO) => {
      queryClient.invalidateQueries({
        queryKey: ["space", spaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
      });
      // update local space
      setSpace({
        layers: data,
      });
    },
    [queryClient, setSpace, spaceId]
  );

  // handler backend event
  useEffect(() => {
    socket?.on(
      "space:card:update-layer",
      (data: SpaceCardUpdateLayerResponseDTO) => {
        updateSpaceCardLayer(data);
      }
    );

    return () => {
      socket?.off("space:card:update-layer");
    };
  }, [updateSpaceCardLayer]);
}

export default useUpdateSpaceCardLayerSocketManagement;