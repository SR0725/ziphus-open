import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { LinkSpaceCardRemoveDTO, SpaceCardDTO } from "@repo/shared-types";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

async function fetchDeleteSpaceCardLink(
  spaceId: string,
  data: LinkSpaceCardRemoveDTO
) {
  return await axiosInstance.delete<SpaceCardDTO>(
    `/space/${spaceId}/space-card/link`,
    {
      data,
    }
  );
}

function useDeleteSpaceCardLinkCase(): UseMutationResult<
  AxiosResponse<SpaceCardDTO>,
  unknown,
  LinkSpaceCardRemoveDTO & {
    spaceId: string;
  },
  unknown
> {
  // handler start
  const mutate = useMutation({
    mutationFn: (
      data: LinkSpaceCardRemoveDTO & {
        spaceId: string;
      }
    ) => {
      return fetchDeleteSpaceCardLink(data.spaceId, data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutate;
}

export default useDeleteSpaceCardLinkCase;
