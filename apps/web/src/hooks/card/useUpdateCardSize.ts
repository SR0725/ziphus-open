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

interface UpdateCardSizeData {
  width: number;
  height: number;
}

async function fetchUpdateCardSize(cardId: string, data: UpdateCardSizeData) {
  return await axiosInstance.put(`/card/${cardId}/size`, data);
}

function useUpdateCardSize(
  cardId: string,
  onCardSizeChange: (width: number, height: number) => void
): UseMutationResult<
  AxiosResponse<void>,
  unknown,
  UpdateCardSizeData,
  unknown
> {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateCardSizeData) => {
      onCardSizeChange(data.width, data.height);
      return fetchUpdateCardSize(cardId, {
        width: data.width,
        height: data.height,
      });
    },
    onError: (error) => {
      toast.error(JSON.stringify(error.message));
    },
  });

  useEffect(() => {
    socket?.on(
      `card:${cardId}:size-modified`,
      (data: { width: number; height: number }) => {
        onCardSizeChange(data.width, data.height);
        queryClient.invalidateQueries({ queryKey: ["cards", cardId] });
        queryClient.invalidateQueries({ queryKey: ["cards"] });
      }
    );

    return () => {
      socket?.off(`card:${cardId}:size-modified`);
    };
  }, [cardId]);

  return mutation;
}

export default useUpdateCardSize;
