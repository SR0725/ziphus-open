import { useEffect } from "react";
import useSocket from "../useSocket";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

interface UpdateCardIsSizeFitContentData {
  isSizeFitContent: boolean;
}

async function fetchIsSizeFitContent(
  cardId: string,
  data: UpdateCardIsSizeFitContentData
) {
  return await axiosInstance.put(`/card/${cardId}/is-size-fit-content`, data);
}

function useUpdateCardIsSizeFitContent(
  cardId: string,
  onCardSizeChange: (isSizeFitContent: boolean) => void
): UseMutationResult<
  AxiosResponse<void>,
  unknown,
  UpdateCardIsSizeFitContentData,
  unknown
> {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateCardIsSizeFitContentData) => {
      onCardSizeChange(data.isSizeFitContent);
      return fetchIsSizeFitContent(cardId, {
        isSizeFitContent: data.isSizeFitContent,
      });
    },
    onError: (error) => {
      toast.error(JSON.stringify(error.message));
    },
  });

  useEffect(() => {
    socket?.on(
      `card:${cardId}:is-size-fit-content`,
      (data: UpdateCardIsSizeFitContentData) => {
        onCardSizeChange(data.isSizeFitContent);
        queryClient.invalidateQueries({ queryKey: ["cards", cardId] });
        queryClient.invalidateQueries({ queryKey: ["cards"] });
      }
    );

    return () => {
      socket?.off(`card:${cardId}:is-size-fit-content`);
    };
  }, [cardId]);

  return mutation;
}

export default useUpdateCardIsSizeFitContent;
