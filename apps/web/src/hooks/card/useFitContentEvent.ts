import { useCallback, useEffect } from "react";

const useFitContentEvent = (
  spaceCardId: string | undefined,
  onFitContent: () => void
) => {
  const handleFitContent = useCallback((event: any) => {
    if (event.detail.spaceCardId !== spaceCardId) return;
    onFitContent();
  }, []);

  useEffect(() => {
    window.addEventListener("space-card-fit-content", handleFitContent);

    return () => {
      window.removeEventListener("space-card-fit-content", handleFitContent);
    };
  }, []);
};

export default useFitContentEvent;
