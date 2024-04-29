import { useEffect } from "react";
import useSocket from "../useSocket";
import { AxiosResponse } from "axios";
import {
  SpaceCardUpdateLayerRequestDTO,
  SpaceCardUpdateLayerResponseDTO,
} from "@repo/shared-types";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { SpaceWithFullData } from "./useQuerySpaceWithFullData";

async function fetchUpdateSpaceCardLayer(
  spaceId: string,
  spaceCardId: string,
  data: {
    operation: SpaceCardUpdateLayerRequestDTO["operation"];
  }
) {
  return await axiosInstance.put<SpaceCardUpdateLayerResponseDTO>(
    `/space/${spaceId}/space-card/${spaceCardId}/layer`,
    data
  );
}

function useUpdateSpaceCardLayer(
  setLocalSpace: React.Dispatch<React.SetStateAction<SpaceWithFullData>>,
  localSpace: SpaceWithFullData
): UseMutationResult<
  AxiosResponse<SpaceCardUpdateLayerResponseDTO>,
  unknown,
  SpaceCardUpdateLayerRequestDTO & {
    spaceId: string;
    spaceCardId: string;
  },
  unknown
> {
  const { socket } = useSocket(localSpace?.id);
  const queryClient = useQueryClient();
  const updateSpaceCardLayer = async (
    data: SpaceCardUpdateLayerResponseDTO
  ) => {
    queryClient.invalidateQueries({
      queryKey: ["space", localSpace?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ["spaces"],
    });
    if (!localSpace) {
      return;
    }
    setLocalSpace({
      ...localSpace,
      layers: data,
    });
  };

  const mutate = useMutation({
    mutationFn: (
      data: SpaceCardUpdateLayerRequestDTO & {
        spaceId: string;
        spaceCardId: string;
      }
    ) => {
      return fetchUpdateSpaceCardLayer(data.spaceId, data.spaceCardId, data);
    },
  });

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
  }, [localSpace?.id, localSpace?.spaceCards]);
  return mutate;
}

export default useUpdateSpaceCardLayer;
