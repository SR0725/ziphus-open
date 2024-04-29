import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { SpaceCreateResponseDTO } from "@repo/shared-types";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

async function fetchCreateSpace() {
  return await axiosInstance.post<SpaceCreateResponseDTO>("/space");
}

function useCreateSpace(): UseMutationResult<
  AxiosResponse<SpaceCreateResponseDTO>,
  unknown,
  void,
  unknown
> {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: fetchCreateSpace,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      toast.success("Space created successfully");
    },
  });
  return mutate;
}

export default useCreateSpace;
