import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { SpaceCreateResponseDTO } from "@repo/shared-types";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

async function fetchCreateSpace({
  pdfFile,
  url,
  text,
  developerSetting,
}: {
  pdfFile?: File;
  url?: string;
  text?: string;
  developerSetting?: {
    outlinePrompt?: string;
    splitCardPrompt?: string;
    useLLM?: string;
  };
}) {
  return await axiosInstance.post<SpaceCreateResponseDTO>(
    `/space${
      pdfFile ? "/with-pdf" : url ? "/with-url" : text ? "/with-markdown" : ""
    }`,
    pdfFile
      ? new FormData().append("file", pdfFile)
      : url
        ? {
            url,
            developerSetting,
          }
        : text
          ? {
              text,
              developerSetting,
            }
          : undefined
  );
}

function useCreateSpace(): UseMutationResult<
  AxiosResponse<SpaceCreateResponseDTO>,
  unknown,
  {
    pdfFile?: File;
    url?: string;
    text?: string;
    developerSetting?: {
      outlinePrompt?: string;
      splitCardPrompt?: string;
      useLLM?: string;
    };
  },
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
