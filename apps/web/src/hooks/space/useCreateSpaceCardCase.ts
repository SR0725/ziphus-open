import { useCallback } from "react";
import { AxiosResponse } from "axios";
import { useShallow } from "zustand/react/shallow";
import {
  SpaceCardCreateResponseDTO,
  SpaceCardCreateRequestDTO,
} from "@repo/shared-types";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useSpaceStore from "@/stores/useSpaceStore";
import axiosInstance from "@/utils/axios";

export async function fetchCreateSpaceCard(
  spaceId: string,
  data: {
    targetCardId: string;
    x: number;
    y: number;
  }
) {
  return await axiosInstance.post<SpaceCardCreateResponseDTO>(
    `/space/${spaceId}/space-card`,
    data
  );
}

function useCreateSpaceCardCase(): UseMutationResult<
  AxiosResponse<SpaceCardCreateResponseDTO>,
  unknown,
  SpaceCardCreateRequestDTO & {
    spaceId: string;
  },
  unknown
> {
  const { spaceId, setSpace } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
      setSpace: useSpaceStore.setState,
    }))
  );

  const queryClient = useQueryClient();

  // handler result
  const createSpaceCard = useCallback(
    async (data: SpaceCardCreateResponseDTO) => {
      // invalidate space query cache
      queryClient.invalidateQueries({
        queryKey: ["space", spaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
      });
      // update local space
      const spaceCards = useSpaceStore.getState().spaceCards;
      if (spaceCards.some((card) => card.id === data.spaceCard.id)) return;
      console.log("createSpaceCard", data.spaceCard);
      setSpace({
        spaceCards: [...spaceCards, data.spaceCard],
        layers: [...useSpaceStore.getState().layers, data.spaceCard.id],
      });
    },
    [queryClient, setSpace, spaceId]
  );

  // handler start
  const mutate = useMutation({
    mutationFn: (
      data: SpaceCardCreateRequestDTO & {
        spaceId: string;
      }
    ) => fetchCreateSpaceCard(data.spaceId, data),
    onSuccess: (data) => {
      createSpaceCard(data.data);
    },
  });

  return mutate;
}

export default useCreateSpaceCardCase;
