import { AxiosResponse } from "axios";
import { toast } from "sonner";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

async function fetchUpdateCardTitle(cardId: string, title: string) {
  return await axiosInstance.put(`/card/${cardId}/title`, {
    title,
  });
}

function useUpdateCardTitle(
  cardId: string
): UseMutationResult<AxiosResponse<void>, unknown, string, unknown> {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (title: string) => fetchUpdateCardTitle(cardId, title),
    onSuccess: (_, title) => {
      queryClient.invalidateQueries({ queryKey: ["cards", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: (error) => {
      toast.error(JSON.stringify(error.message));
    },
  });

  return mutation;
}

export default useUpdateCardTitle;
