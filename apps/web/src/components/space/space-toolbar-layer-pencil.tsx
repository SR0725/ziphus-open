import { PencilInfo } from "@/components/card/card-editor-sketch-panel";
import { cn } from "@/utils/cn";

const pencilWidths = [2, 4, 8, 16];
const pencilColors = ["white", "red", "blue", "green", "yellow"];

interface SpaceToolbarLayerPencilProps {
  pencilInfo: PencilInfo;
  setPencilInfo: (info: PencilInfo) => void;
}
function SpaceToolbarLayerPencil({
  pencilInfo,
  setPencilInfo,
}: SpaceToolbarLayerPencilProps) {
  return (
    <div className="flex flex-col gap-2">
      {pencilWidths.map((width, index) => (
        <button
          key={width}
          className={cn(
            "h-6 rounded-full border",
            pencilInfo.pencilSize === width
              ? "border-gray-200"
              : "border-transparent"
          )}
          style={{
            width: `${16 + 4 * index}px`,
            height: `${16 + 4 * index}px`,
            backgroundColor:
              pencilInfo.pencilSize === width ? pencilInfo.pencilColor : "gray",
          }}
          onClick={(event) => {
            event.stopPropagation();
            setPencilInfo({
              pencilColor: pencilInfo.pencilColor,
              pencilSize: width,
            });
          }}
        />
      ))}
      <div className="my-4"></div>
      {pencilColors.map((color) => (
        <button
          key={color}
          className={`h-6 w-6 rounded-full border border-solid border-gray-200 ${
            pencilInfo.pencilColor === color
              ? "border-gray-600"
              : "border-transparent"
          }`}
          style={{
            backgroundColor: color,
          }}
          onClick={(event) => {
            event.stopPropagation();
            setPencilInfo({
              pencilColor: color,
              pencilSize: pencilInfo.pencilSize,
            });
          }}
        />
      ))}
    </div>
  );
}

export default SpaceToolbarLayerPencil;
