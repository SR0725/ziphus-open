import useMobileViewStore from "@/stores/useMobileViewStore";

function useMobileMindMap(initialFocusSpaceCardId?: string | null) {
  const isMindMapOpen = useMobileViewStore((state) => state.isMindMapOpen);

  const toggleIsMindMapOpen = () => {
    useMobileViewStore.setState({
      isMindMapOpen: !isMindMapOpen,
    });
  };

  return {
    isMindMapOpen,
    toggleIsMindMapOpen,
  };
}

export default useMobileMindMap;
