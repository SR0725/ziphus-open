import { useRef } from "react";
import * as Y from "yjs";
import { Circle, ShapeType } from "@repo/sketch-canvas";
import { EraserInfo } from "@/components/card/card-editor-sketch-panel";
import Stroke from "@/models/stroke";
import isCircleTouchingWideLine from "@/utils/is-circle-touching-wide-line";

interface UseActionProps {
  remoteYArray: Y.Array<any>;
  originalStrokesRef: React.MutableRefObject<Stroke[]>;
  eraserInfo: EraserInfo;
  refresh: () => void;
}
const useEraseAction = ({
  remoteYArray,
  originalStrokesRef,
  eraserInfo,
  refresh,
}: UseActionProps) => {
  const isErasing = useRef(false);
  const eraserRef = useRef<Circle | null>(null);

  const handleStartErase = (x: number, y: number) => {
    isErasing.current = true;
    handleMoveErase(x, y);
  };

  // 尋找在接觸點附近的筆跡
  const handleMoveErase = (x: number, y: number) => {
    if (!isErasing.current) return;
    const size = eraserInfo.eraserSize;
    const needDeleteStrokeIdList: string[] = [];

    for (let i = 0; i < remoteYArray.length; i++) {
      const lines = remoteYArray.get(i).get("lines");
      const isTouching = lines.some((line: any) =>
        isCircleTouchingWideLine({ x, y, size }, line)
      );

      if (isTouching) {
        needDeleteStrokeIdList.push(remoteYArray.get(i).get("id"));
        remoteYArray.delete(i);
        i--;
      }
    }

    originalStrokesRef.current = originalStrokesRef.current.filter(
      (stroke) => !needDeleteStrokeIdList.includes(stroke.id)
    );
    eraserRef.current = {
      id: "eraser",
      x,
      y,
      radius: size / 2,
      type: ShapeType.Circle,
      fillStyle: "#ffffff22",
      strokeStyle: "#ffffff88",
      lineWidth: 1,
    };
    refresh();
  };

  const handleEndErase = () => {
    isErasing.current = false;
    eraserRef.current = null;
    refresh();
  };

  return {
    eraserRef,
    handleMoveErase,
    handleStartErase,
    handleEndErase,
  };
};

export default useEraseAction;
