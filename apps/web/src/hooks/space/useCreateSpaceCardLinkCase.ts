import { AxiosResponse } from "axios";
import { toast } from "sonner";
import {
  LinkSpaceCardConnectRequestDTO,
  SpaceCardDTO,
} from "@repo/shared-types";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

export async function fetchCreateSpaceCardLink(
  spaceId: string,
  data: LinkSpaceCardConnectRequestDTO
) {
  return await axiosInstance.post<SpaceCardDTO>(
    `/space/${spaceId}/space-card/link`,
    data
  );
}

function useCreateSpaceCardLinkCardCase(spaceCardId: string): UseMutationResult<
  AxiosResponse<SpaceCardDTO>,
  unknown,
  LinkSpaceCardConnectRequestDTO & {
    spaceId: string;
  },
  unknown
> {
  // handler start
  const mutate = useMutation({
    mutationFn: (
      data: LinkSpaceCardConnectRequestDTO & {
        spaceId: string;
      }
    ) => {
      return fetchCreateSpaceCardLink(data.spaceId, data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutate;
}

export default useCreateSpaceCardLinkCardCase;
