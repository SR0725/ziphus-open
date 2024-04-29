import {
  SpaceGetByIdResponseDTO,
  SpaceCardListGetBySpaceIdResponseDTO,
} from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

export type SpaceWithFullData = SpaceGetByIdResponseDTO["space"] & {
  spaceCards: SpaceCardListGetBySpaceIdResponseDTO["spaceCards"];
};

export async function fetchSpaceByIdWithFullData(
  spaceId: string
): Promise<SpaceWithFullData | null> {
  const space = await axiosInstance.get<SpaceGetByIdResponseDTO>(
    `/space/${spaceId}`
  );
  const spaceCards =
    await axiosInstance.get<SpaceCardListGetBySpaceIdResponseDTO>(
      `/space/${spaceId}/space-card/list?combineTargetCard=true`
    );

  if (!space.data.space) {
    return null;
  }

  return {
    ...space.data.space,
    spaceCards: spaceCards.data.spaceCards,
  };
}

function useQuerySpaceWithFullData(spaceId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["space", spaceId, "with-card"],
    queryFn: () => fetchSpaceByIdWithFullData(spaceId),
  });
  return { space: data, isLoading, error };
}

export default useQuerySpaceWithFullData;
