import { AxiosResponse } from "axios";
import {
  SpaceCardUpdateLayerRequestDTO,
  SpaceCardUpdateLayerResponseDTO,
} from "@repo/shared-types";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

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

/**
 * 更新空間卡片圖層，並更新本地資料
 * @returns mutate
 */
function useUpdateSpaceCardLayerCase(): UseMutationResult<
  AxiosResponse<SpaceCardUpdateLayerResponseDTO>,
  unknown,
  SpaceCardUpdateLayerRequestDTO & {
    spaceId: string;
    spaceCardId: string;
  },
  unknown
> {
  // handler start
  const mutate = useMutation({
    mutationFn: (
      data: SpaceCardUpdateLayerRequestDTO & {
        spaceId: string;
        spaceCardId: string;
      }
    ) => {
      // TODO: 應該立即更新本地資料，而不是等待伺服器回應
      return fetchUpdateSpaceCardLayer(data.spaceId, data.spaceCardId, data);
    },
  });

  return mutate;
}

export default useUpdateSpaceCardLayerCase;
