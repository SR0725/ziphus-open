import { AxiosResponse } from "axios";
import { CardCreateResponseDTO } from "@repo/shared-types";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

async function fetchCreateCard() {
  return await axiosInstance.post<CardCreateResponseDTO>("/card");
}

function useCreateCard(): UseMutationResult<
  AxiosResponse<CardCreateResponseDTO>,
  unknown,
  void,
  unknown
> {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: fetchCreateCard,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cards"],
      });
    },
  });
  return mutate;
}

export default useCreateCard;
