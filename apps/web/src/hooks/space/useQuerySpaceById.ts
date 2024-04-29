import { SpaceGetByIdResponseDTO } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

export async function fetchSpaceById(spaceId: string) {
  return await axiosInstance.get<SpaceGetByIdResponseDTO>(`/space/${spaceId}`);
}

function useQuerySpaceById(spaceId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["space", spaceId],
    queryFn: () => fetchSpaceById(spaceId),
  });
  const space = data?.data.space ?? null;
  return { space, isLoading, error };
}

export default useQuerySpaceById;
