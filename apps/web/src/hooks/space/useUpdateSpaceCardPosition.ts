import { useEffect, useRef } from "react";
import {
  SpaceCardDTO,
  SpaceCardImmediateUpdatePositionRequestDTO,
} from "@repo/shared-types";
import useSocket from "@/hooks/useSocket";

function useUpdateSpaceCardPosition(
  spaceCardRef: React.MutableRefObject<SpaceCardDTO>
) {
  const lastUpdateTimestamp = useRef<number>(0);
  const targetSpaceCardPosition = useRef({ x: 0, y: 0 });
  const transitionFrameIdRef = useRef<number>(0);
  const { socketEmitWithAuth, socket } = useSocket(
    spaceCardRef.current.targetSpaceId
  );

  function handleUpdatePosition(
    data: SpaceCardImmediateUpdatePositionRequestDTO
  ) {
    if (Date.now() - lastUpdateTimestamp.current < 100) {
      return;
    }
    socketEmitWithAuth("space:card:update-position", data);
    lastUpdateTimestamp.current = Date.now();
  }

  useEffect(() => {
    function updatePositionAnimation() {
      if (
        spaceCardRef.current.x !== targetSpaceCardPosition.current.x ||
        spaceCardRef.current.y !== targetSpaceCardPosition.current.y
      ) {
        const dx = targetSpaceCardPosition.current.x - spaceCardRef.current.x;
        const dy = targetSpaceCardPosition.current.y - spaceCardRef.current.y;
        const speed = 0.1;
        spaceCardRef.current.x += dx * speed;
        spaceCardRef.current.y += dy * speed;

        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          spaceCardRef.current.x = targetSpaceCardPosition.current.x;
          spaceCardRef.current.y = targetSpaceCardPosition.current.y;
        } else {
          transitionFrameIdRef.current = requestAnimationFrame(
            updatePositionAnimation
          );
        }
      }
    }

    socket?.on(
      `space:card:${spaceCardRef.current.id}:update-position`,
      (data: SpaceCardImmediateUpdatePositionRequestDTO) => {
        targetSpaceCardPosition.current = { x: data.x, y: data.y };
        transitionFrameIdRef.current = requestAnimationFrame(
          updatePositionAnimation
        );
      }
    );

    return () => {
      socket?.off(`space:card:${spaceCardRef.current.id}:update-position`);
      cancelAnimationFrame(transitionFrameIdRef.current);
    };
  }, [spaceCardRef.current.id]);

  return { handleUpdatePosition };
}

export default useUpdateSpaceCardPosition;
