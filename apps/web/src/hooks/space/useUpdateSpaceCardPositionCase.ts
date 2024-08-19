import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  SpaceCardDTO,
  SpaceCardImmediateUpdatePositionRequestDTO,
} from "@repo/shared-types";
import useSocket from "@/hooks/useSocket";
import useSpaceStore from "@/stores/useSpaceStore";

/**
 * 提供更新卡片位置的方法，並處理與伺服器同步
 */
function useUpdateSpaceCardPositionCase(spaceCardId: string) {
  // 初始化所需資料
  const { spaceId } = useSpaceStore(
    useShallow((state) => ({
      spaceId: state.id,
    }))
  );

  const setSpaceCard = useCallback(
    (
      newSpaceCard: Partial<SpaceCardDTO> & {
        id: string;
      }
    ) => {
      const spaceCards = useSpaceStore.getState().spaceCards;

      useSpaceStore.setState({
        spaceCards: spaceCards.map((oldSpaceCard) =>
          oldSpaceCard.id === newSpaceCard.id
            ? {
                ...oldSpaceCard,
                ...newSpaceCard,
              }
            : oldSpaceCard
        ),
      });
    },

    []
  );

  const lastUpdateTimestamp = useRef<number>(0);
  const targetSpaceCardPosition = useRef({ x: 0, y: 0 });
  const transitionFrameIdRef = useRef<number>(0);
  const { socketEmitWithAuth, socket } = useSocket(spaceId);

  // handler start
  function handleUpdatePosition(
    data: SpaceCardImmediateUpdatePositionRequestDTO
  ) {
    // 更新本地資料
    setSpaceCard({
      id: spaceCardId,
      x: data.x,
      y: data.y,
    });
    // 防止過於頻繁的更新
    if (Date.now() - lastUpdateTimestamp.current < 100) {
      return;
    }
    // 與伺服器同步
    socketEmitWithAuth("space:card:update-position", data);
    lastUpdateTimestamp.current = Date.now();
  }

  // handler backend event
  useEffect(() => {
    /** 線性插入各個 frame 的位置，避免位置跳動 */
    function updatePositionAnimation() {
      const spaceCard = useSpaceStore
        .getState()
        .spaceCards.find((sc) => sc.id === spaceCardId)!;
      if (
        spaceCard.x !== targetSpaceCardPosition.current.x ||
        spaceCard.y !== targetSpaceCardPosition.current.y
      ) {
        const dx = targetSpaceCardPosition.current.x - spaceCard.x;
        const dy = targetSpaceCardPosition.current.y - spaceCard.y;
        const speed = 0.1;
        setSpaceCard({
          id: spaceCardId,
          x: spaceCard.x + dx * speed,
          y: spaceCard.y + dy * speed,
        });

        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          setSpaceCard({
            id: spaceCardId,
            x: targetSpaceCardPosition.current.x,
            y: targetSpaceCardPosition.current.y,
          });
          transitionFrameIdRef.current = 0;
        } else {
          transitionFrameIdRef.current = requestAnimationFrame(
            updatePositionAnimation
          );
        }
      }
    }

    socket?.on(
      `space:card:${spaceCardId}:update-position`,
      (data: SpaceCardImmediateUpdatePositionRequestDTO) => {
        targetSpaceCardPosition.current = { x: data.x, y: data.y };
        if (transitionFrameIdRef.current) {
          cancelAnimationFrame(transitionFrameIdRef.current);
        }
        transitionFrameIdRef.current = requestAnimationFrame(
          updatePositionAnimation
        );
      }
    );

    return () => {
      socket?.off(`space:card:${spaceCardId}:update-position`);
      cancelAnimationFrame(transitionFrameIdRef.current);
    };
  }, [spaceCardId]);

  return handleUpdatePosition;
}

export default useUpdateSpaceCardPositionCase;
