import { useRef, useCallback } from "react";
import { v4 } from "uuid";
import * as Y from "yjs";
import { PencilInfo } from "@/components/card/card-editor-sketch-panel";
import Line from "@/models/line";
import Stroke from "@/models/stroke";

// 判斷線條是否可以合併：基於端點距離
function isMergeAble(line1: Line, line2: Line): boolean {
  // 定義合併的容忍度，這個值可以根據實際效果進行調整
  const tolerance = 10;

  // 檢查 line1 的結束點到 line2 的起始點的距離是否在容忍度內
  const distance =
    Math.pow(line2.endX - line1.startX, 2) +
    Math.pow(line2.endY - line1.startY, 2);

  return distance <= tolerance;
}

// 合併兩條線條
function mergeLines(line1: Line, line2: Line): Line {
  // 將 line2 的結束點設置為 line1 的新結束點
  return new Line(
    line1.strokeId,
    line1.color,
    line1.width,
    line1.startX,
    line1.startY,
    line2.endX,
    line2.endY
  );
}

// 優化線條的函數
function optimizeLines(lines: Line[]): Line[] {
  const optimizedLines: Line[] = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i]!;
    if (optimizedLines.length > 0) {
      const lastOptimizedLine = optimizedLines[optimizedLines.length - 1]!;
      if (isMergeAble(lastOptimizedLine, currentLine)) {
        // 如果可以合併，更新最後一條優化過的線條的結束點
        optimizedLines[optimizedLines.length - 1] = mergeLines(
          lastOptimizedLine,
          currentLine
        );
      } else {
        // 如果不可以合併，將當前線條添加到優化過的線條陣列中
        optimizedLines.push(currentLine);
      }
    } else {
      // 如果優化過的線條陣列為空，直接添加當前線條
      optimizedLines.push(currentLine);
    }
  }

  return optimizedLines;
}

interface UseActionProps {
  remoteYArray: Y.Array<any>;
  originalStrokesRef: React.MutableRefObject<Stroke[]>;
  pencilInfo: PencilInfo;
  refresh: () => void;
}
const useDrawAction = ({
  remoteYArray,
  originalStrokesRef,
  pencilInfo,
  refresh,
}: UseActionProps) => {
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const currentYStrokeRef = useRef<Y.Map<any> | null>(null);

  // 新增筆跡
  const handleStartDraw = (x: number, y: number,pressure: number) => {
    const strokeId = v4();
    currentStrokeRef.current = new Stroke(strokeId, [
      new Line(
        strokeId,
        pencilInfo.pencilColor,
        pencilInfo.pencilSize * pressure,
        x,
        y,
        x,
        y
      ),
    ]);
    originalStrokesRef.current.push(currentStrokeRef.current);
    isDrawingRef.current = true;
  };

  // 在該筆跡中新增路徑
  const handleMoveDraw = useCallback(
    (x: number, y: number, pressure: number) => {
      if (!isDrawingRef.current || !currentStrokeRef.current) return;

      // 取得當前筆跡
      const currentStroke = currentStrokeRef.current;
      const lastLine = currentStroke.lines[currentStroke.lines.length - 1];

      // 創建路徑
      const newLine = new Line(
        currentStroke.id,
        pencilInfo.pencilColor,
        pencilInfo.pencilSize * pressure,
        lastLine ? lastLine.endX : x,
        lastLine ? lastLine.endY : y,
        x,
        y
      );

      currentStrokeRef.current.lines.push(newLine);
      refresh();
    },
    [isDrawingRef.current, pencilInfo.pencilColor, pencilInfo.pencilSize]
  );

  // 結束筆跡
  const handleEndDraw = () => {
    // 優化筆跡
    if (currentStrokeRef.current) {
      currentStrokeRef.current.lines = optimizeLines(
        currentStrokeRef.current.lines
      );
    }

    // 將筆跡送入遠端
    if (!currentStrokeRef.current) return;
    currentYStrokeRef.current = new Y.Map();
    currentYStrokeRef.current.set("id", currentStrokeRef.current.id);
    currentYStrokeRef.current.set("lines", currentStrokeRef.current.lines);
    remoteYArray.push([currentYStrokeRef.current]);
    isDrawingRef.current = false;
  };

  return { handleStartDraw, handleMoveDraw, handleEndDraw };
};

export default useDrawAction;
