import { useEffect } from "react";
import useSocket from "../useSocket";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useCardsStore from "@/stores/useCardsStore";
import axiosInstance from "@/utils/axios";

interface UpdateCardIsSizeFitContentData {
  cardId: string;
  isSizeFitContent: boolean;
}

async function fetchIsSizeFitContent(
  cardId: string,
  data: UpdateCardIsSizeFitContentData
) {
  return await axiosInstance.put(`/card/${cardId}/is-size-fit-content`, data);
}

function useUpdateCardIsSizeFitContentCase(
  cardId: string
): UseMutationResult<
  AxiosResponse<void>,
  unknown,
  UpdateCardIsSizeFitContentData,
  unknown
> {
  // 初始化所需資料
  const { setCard } = useCardsStore(
    useShallow((state) => ({
      setCard: state.setCard,
    }))
  );

  const queryClient = useQueryClient();

  // handler result
  const handleCardIsSizeFitContent = (isSizeFitContent: boolean) => {
    setCard({
      id: cardId,
      isSizeFitContent,
    });
    queryClient.invalidateQueries({ queryKey: ["cards", cardId] });
    queryClient.invalidateQueries({ queryKey: ["cards"] });
  };

  // handler start
  const mutation = useMutation({
    mutationFn: (data: UpdateCardIsSizeFitContentData) => {
      handleCardIsSizeFitContent(data.isSizeFitContent);
      return fetchIsSizeFitContent(cardId, {
        cardId,
        isSizeFitContent: data.isSizeFitContent,
      });
    },
    onError: (error) => {
      toast.error(JSON.stringify(error.message));
    },
  });

  return mutation;
}

export default useUpdateCardIsSizeFitContentCase;
