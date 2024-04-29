import { AxiosResponse } from "axios";
import { toast } from "sonner";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

async function fetchDeleteCardTitle(cardId: string) {
  return await axiosInstance.delete(`/card/${cardId}`);
}

function useDeleteCardTitle(
  cardId: string
): UseMutationResult<AxiosResponse<void>, unknown, void, unknown> {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => fetchDeleteCardTitle(cardId),
    onSuccess: (_, title) => {
      queryClient.invalidateQueries({ queryKey: ["cards", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("卡片刪除成功");
    },
    onError: (error) => {
      toast.error(JSON.stringify(error.message));
    },
  });

  return mutation;
}

export default useDeleteCardTitle;
