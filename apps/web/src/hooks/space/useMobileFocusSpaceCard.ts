import { useEffect, useState } from "react";
import { SpaceCardDTO } from "@repo/shared-types";
import useMobileViewStore from "@/stores/useMobileViewStore";
import useSpaceStore from "@/stores/useSpaceStore";
import useGetSpaceCard from "./useGetSpaceCard";

function useMobileFocusSpaceCard(initialFocusSpaceCardId?: string | null) {
  const focusSpaceCardId = useMobileViewStore(
    (state) => state.focusSpaceCardId
  );
  const noteCardOrder = useMobileViewStore((state) => state.noteCardOrder);
  const [focusSpaceCard, setFocusSpaceCard] = useState<SpaceCardDTO | null>(
    null
  );
  const getSpaceCard = useGetSpaceCard();
  useEffect(() => {
    if (initialFocusSpaceCardId) {
      useMobileViewStore.setState({
        focusSpaceCardId: initialFocusSpaceCardId,
      });
    }
  }, [initialFocusSpaceCardId]);
  useEffect(() => {
    if (focusSpaceCardId) {
      setFocusSpaceCard(getSpaceCard(focusSpaceCardId) || null);
    }
  }, [focusSpaceCardId]);

  const getNextSpaceCardId = () => {
    if (!focusSpaceCard) return null;
    const index = noteCardOrder.findIndex(
      (noteCardId) => noteCardId === focusSpaceCard.id
    );
    return noteCardOrder[index + 1] || null;
  };

  const goNextSpaceCard = () => {
    const nextSpaceCardId = getNextSpaceCardId();
    if (nextSpaceCardId) {
      useMobileViewStore.setState({ focusSpaceCardId: nextSpaceCardId });
    }
  };

  const getPrevSpaceCardId = () => {
    if (!focusSpaceCard) return null;
    const index = noteCardOrder.findIndex(
      (noteCardId) => noteCardId === focusSpaceCard.id
    );
    return noteCardOrder[index - 1] || null;
  };

  const goPrevSpaceCard = () => {
    const prevSpaceCardId = getPrevSpaceCardId();
    if (prevSpaceCardId) {
      useMobileViewStore.setState({ focusSpaceCardId: prevSpaceCardId });
    }
  };

  const goTargetSpaceCard = (targetSpaceCardId: string) => {
    useMobileViewStore.setState({ focusSpaceCardId: targetSpaceCardId });
  };

  const getIsBehindFocusSpaceCard = (spaceCardId: string) => {
    if (!focusSpaceCard) return false;
    const focusSpaceCardIndex = noteCardOrder.findIndex(
      (noteCardId) => noteCardId === focusSpaceCard.id
    );
    const spaceCardIndex = noteCardOrder.findIndex(
      (noteCardId) => noteCardId === spaceCardId
    );

    if (Math.abs(focusSpaceCardIndex - spaceCardIndex) === 1) {
      return true;
    }
    return false;
  };

  return {
    focusSpaceCard,
    getNextSpaceCardId,
    goNextSpaceCard,
    getPrevSpaceCardId,
    goPrevSpaceCard,
    goTargetSpaceCard,
    getIsBehindFocusSpaceCard,
  };
}

export default useMobileFocusSpaceCard;
