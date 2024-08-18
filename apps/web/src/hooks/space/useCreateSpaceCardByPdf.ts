import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { LinkSpaceCardConnectRequestDTO, SpaceCardDTO } from "@repo/shared-types";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";


export async function fetchCreateSpaceCardByPdf({
  pdfFile,
  spaceId,
}: {
  pdfFile: File;
  spaceId: string;
}) {
  const formData = new FormData();
  formData.append("file", pdfFile);
  return await axiosInstance.post<SpaceCardDTO[]>(
    `/space/${spaceId}/space-card/from-pdf`,
    formData
  );
}

function useCreateSpaceCardLByPdf(spaceCardId: string): UseMutationResult<
  AxiosResponse<SpaceCardDTO[]>,
  unknown,
  {
    pdfFile: File;
    spaceId: string;
  },
  unknown
> {
  // handler start
  const mutate = useMutation({
    mutationFn: fetchCreateSpaceCardByPdf,
    onSuccess: (data) => {
      toast.success("Create space card by pdf success");
    },
  });

  return mutate;
}

export default useCreateSpaceCardLByPdf;