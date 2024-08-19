import { useCallback, useEffect } from "react";
import { AxiosResponse } from "axios";
import { useShallow } from "zustand/react/shallow";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useEditorStore from "@/stores/useEditorStore";
import useSpaceStore from "@/stores/useSpaceStore";
import axiosInstance from "@/utils/axios";

async function fetchDeleteSpaceCard(spaceId: string, spaceCardId: string) {
  return await axiosInstance.delete(
    `/space/${spaceId}/space-card/${spaceCardId}`
  );
}

/**
 * 刪除空間卡片，並更新本地資料
 * @returns mutate
 */
function useDeleteSpaceCardCase(): UseMutationResult<
  AxiosResponse<void>,
  unknown,
  { spaceId: string; spaceCardId: string },
  unknown
> {
  const { spaceId, spaceCards, setSpace } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
      spaceCards: state.spaceCards,
      setSpace: useSpaceStore.setState,
    }))
  );
  const { focusSpaceCardId, selectedSpaceCardIdList, setEditorState } =
    useEditorStore(
      useShallow((state) => ({
        focusSpaceCardId: state.focusSpaceCardId,
        selectedSpaceCardIdList: state.selectedSpaceCardIdList,
        setEditorState: useEditorStore.setState,
      }))
    );

  const queryClient = useQueryClient();

  // handler result
  const removeSpaceCard = useCallback(
    async (spaceCardId: string) => {
      // invalidate space query cache
      queryClient.invalidateQueries({
        queryKey: ["space", spaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
      });
      // update local space
      const { spaceCards, layers } = useSpaceStore.getState();
      setSpace({
        spaceCards: spaceCards.filter((card) => card.id !== spaceCardId),
        layers: layers.filter((layer) => layer !== spaceCardId),
      });
      setEditorState({
        focusSpaceCardId:
          focusSpaceCardId === spaceCardId ? null : focusSpaceCardId,
        selectedSpaceCardIdList: selectedSpaceCardIdList.filter(
          (id) => id !== spaceCardId
        ),
      });
    },
    [
      focusSpaceCardId,
      queryClient,
      selectedSpaceCardIdList,
      setEditorState,
      setSpace,
      spaceCards,
      spaceId,
    ]
  );

  // handler start
  const mutate = useMutation({
    mutationKey: ["space", spaceId, "delete"],
    mutationFn: ({
      spaceId,
      spaceCardId,
    }: {
      spaceId: string;
      spaceCardId: string;
    }) => {
      removeSpaceCard(spaceCardId);
      return fetchDeleteSpaceCard(spaceId, spaceCardId);
    },
  });

  return mutate;
}

export default useDeleteSpaceCardCase;
