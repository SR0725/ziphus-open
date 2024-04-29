import { AxiosResponse } from "axios";
import { toast } from "sonner";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

async function fetchUpdateSpaceTitle(spaceId: string, title: string) {
  return await axiosInstance.put(`/space/${spaceId}/title`, {
    title,
  });
}

function useUpdateSpaceTitle(
  spaceId: string
): UseMutationResult<AxiosResponse<void>, unknown, string, unknown> {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (title: string) => fetchUpdateSpaceTitle(spaceId, title),
    onSuccess: (_, title) => {
      queryClient.invalidateQueries({ queryKey: ["spaces", spaceId] });
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
    onError: (error) => {
      toast.error(JSON.stringify(error.message));
    },
  });

  return mutation;
}

export default useUpdateSpaceTitle;
