import useMobileViewStore from "@/stores/useMobileViewStore";

function useMobileInfiniteScrollMode(initialFocusSpaceCardId?: string | null) {
  const isInfiniteScrollMode = useMobileViewStore(
    (state) => state.isInfiniteScrollMode
  );

  const toggleInfiniteScrollMode = () => {
    useMobileViewStore.setState({
      isInfiniteScrollMode: !isInfiniteScrollMode,
    });
  };

  return {
    isInfiniteScrollMode,
    toggleInfiniteScrollMode,
  };
}

export default useMobileInfiniteScrollMode;
