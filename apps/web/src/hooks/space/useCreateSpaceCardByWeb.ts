import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { SpaceCardDTO } from "@repo/shared-types";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

export async function fetchCreateSpaceCardByWeb({
  spaceId,
  url,
}: {
  spaceId: string;
  url: string;
}) {
  return await axiosInstance.post<SpaceCardDTO[]>(
    `/space/${spaceId}/space-card/from-web`,
    {
      url,
    }
  );
}

function useCreateSpaceCardLByWeb(spaceCardId: string): UseMutationResult<
  AxiosResponse<SpaceCardDTO[]>,
  unknown,
  {
    url: string;
    spaceId: string;
  },
  unknown
> {
  // handler start
  const mutate = useMutation({
    mutationFn: fetchCreateSpaceCardByWeb,
    onSuccess: (data) => {
      toast.success("Create space card by pdf success");
    },
  });

  return mutate;
}

export default useCreateSpaceCardLByWeb;
