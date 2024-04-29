import { SpaceGetWithAllResponseDTO } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

async function fetchCardList() {
  return await axiosInstance.get<SpaceGetWithAllResponseDTO>("/spaces");
}

function useQuerySpaceList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["spaces"],
    queryFn: fetchCardList,
  });
  const spaces = data?.data.spaces ?? [];

  return { spaces, isLoading, error };
}

export default useQuerySpaceList;
