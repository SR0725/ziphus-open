import { AxiosResponse } from "axios";
import { CardCreateResponseDTO } from "@repo/shared-types";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

export async function fetchCreateCard(initialContent?: string) {
  return await axiosInstance.post<CardCreateResponseDTO>("/card", {
    initialContent: initialContent,
  });
}

function useCreateCard(): UseMutationResult<
  AxiosResponse<CardCreateResponseDTO>,
  unknown,
  string | undefined,
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
