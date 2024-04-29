import { useEffect } from "react";
import resizeCanvas from "../utils/resize-canvas";

export const useResizeListener = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      resizeCanvas(canvas);
    }
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasRef]);

  return handleResize;
};

