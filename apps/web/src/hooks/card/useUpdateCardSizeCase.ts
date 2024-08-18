import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetCard from "@/hooks/card/useGetCard";
import useCardsStore from "@/stores/useCardsStore";
import axiosInstance from "@/utils/axios";


export interface UpdateCardSizeData {
  width: number;
  height: number;
}

async function fetchUpdateCardSize(cardId: string, data: UpdateCardSizeData) {
  return await axiosInstance.put(`/card/${cardId}/size`, data);
}

function useUpdateCardSizeCase(cardId: string) {
  // 初始化所需資料
  const { setCard } = useCardsStore(
    useShallow((state) => ({
      setCard: state.setCard,
    }))
  );
  const getCard = useGetCard();

  const queryClient = useQueryClient();

  // handler result
  const handleCardSizeChange = (width: number, height: number) => {
    setCard({
      id: cardId,
      width,
      height,
    });
  };

  // handler api fetch port
  const mutation = useMutation({
    mutationFn: (data: UpdateCardSizeData) => {
      handleCardSizeChange(data.width, data.height);
      return fetchUpdateCardSize(cardId, {
        width: data.width,
        height: data.height,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: (error) => {
      toast.error(JSON.stringify(error.message));
    },
  });

  const handleUpdateCardSize = (data: UpdateCardSizeData) => {
    handleCardSizeChange(data.width, data.height);
  };

  const handleUpdateCardSizeFinish = () => {
    const currentCard = getCard(cardId);
    if (!currentCard) return;
    mutation.mutate({
      width: currentCard.width,
      height: currentCard.height,
    });
  };

  return {
    handleUpdateCardSize,
    handleUpdateCardSizeFinish,
  };
}

export default useUpdateCardSizeCase;