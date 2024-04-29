import { CardGetByIdResponseDTO } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

export async function fetchCardById(cardId: string) {
  return await axiosInstance.get<CardGetByIdResponseDTO>(`/card/${cardId}`);
}

function useQueryCardById(cardId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["card", cardId],
    queryFn: () => fetchCardById(cardId),
  });
  const card = data?.data.card ?? null;
  return { card, isLoading, error };
}

export default useQueryCardById;
