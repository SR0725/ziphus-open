import { EraserInfo } from "@/components/card/card-editor-sketch-panel";
import { cn } from "@/utils/cn";

const eraserWidths = [4, 16, 32, 64];

interface SpaceToolbarLayerEraserProps {
  eraserInfo: EraserInfo;
  setEraserInfo: (info: EraserInfo) => void;
}
function SpaceToolbarLayerEraser({
  eraserInfo,
  setEraserInfo,
}: SpaceToolbarLayerEraserProps) {
  return (
    <div className="flex flex-col gap-2">
      {eraserWidths.map((width, index) => (
        <button
          key={width}
          className={cn(
            "rounded-full border",
            eraserInfo.eraserSize === width
              ? "border-gray-200"
              : "border-transparent",
             eraserInfo.eraserSize === width ? "bg-gray-500" : "bg-gray-200 dark:bg-white"
          )}
          style={{
            width: `${16 + 4 * index}px`,
            height: `${16 + 4 * index}px`,
          }}
          onClick={(event) => {
            event.stopPropagation();
            setEraserInfo({
              eraserSize: width,
            });
          }}
        />
      ))}
    </div>
  );
}

export default SpaceToolbarLayerEraser;
