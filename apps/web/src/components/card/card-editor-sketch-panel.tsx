"use client";

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import {
  Shape,
  ShapeType,
  SketchCanvas,
  useSketchCanvasProvider,
  Line,
  CurveLine,
} from "@repo/sketch-canvas";
import useDrawAction from "@/hooks/card-sketch/useDrawAction";
import useEraseAction from "@/hooks/card-sketch/useEraseAction";
import useRemoteStrokeSync from "@/hooks/card-sketch/useRemoteStrokeSync";
import Stroke from "@/models/stroke";

export type EditMode = "text" | "sketch";
export type SketchMode = "pencil" | "eraser";
export interface PencilInfo {
  pencilColor: string;
  pencilSize: number;
}
export interface EraserInfo {
  eraserSize: number;
}

interface CardEditorDrawingPanelProps {
  isActive: boolean;
  cardId: string;
  accountName: string;
  isUseApplePencil: boolean;
  doc: Y.Doc;
  sketchMode: SketchMode;
  pencilInfo: PencilInfo;
  eraserInfo: EraserInfo;
}

function CardEditorSketchPanel({
  isActive,
  cardId,
  accountName,
  isUseApplePencil,
  doc,
  sketchMode,
  pencilInfo,
  eraserInfo,
}: CardEditorDrawingPanelProps) {
  const [yStrokes] = useState(doc.getArray("card-drawing"));
  const [dataFrame, setDataFrame] = useState(0);
  const originalRenderStrokesRef = useRef<Stroke[]>([]);
  const remoteRenderStrokesRef = useRemoteStrokeSync({
    remoteYArray: yStrokes,
    originalStrokesRef: originalRenderStrokesRef,
    refresh: () => setDataFrame((prev) => prev + 1),
  });
  const sketchCanvasProvider = useSketchCanvasProvider({
    isUseApplePencil,
  });

  const { handleStartDraw, handleMoveDraw, handleEndDraw } = useDrawAction({
    remoteYArray: yStrokes,
    originalStrokesRef: originalRenderStrokesRef,
    pencilInfo,
    refresh: () => setDataFrame((prev) => prev + 1),
  });

  const { eraserRef, handleEndErase, handleMoveErase, handleStartErase } =
    useEraseAction({
      remoteYArray: yStrokes,
      originalStrokesRef: originalRenderStrokesRef,
      eraserInfo,
      refresh: () => setDataFrame((prev) => prev + 1),
    });

  useEffect(() => {
    const lines: Line[][] = [
      ...originalRenderStrokesRef.current,
      ...remoteRenderStrokesRef.current,
    ].map((stroke) =>
      stroke.lines.map(
        (line, index) =>
          ({
            id: `${line?.strokeId}:${index}`,
            type: ShapeType.Line,
            startX: line.startX,
            startY: line.startY,
            endX: line.endX,
            endY: line.endY,
            strokeStyle: line.color,
            lineWidth: line.width,
          }) as Line
      )
    );

    const curveLines: CurveLine[] = lines.map((curveLine, index) => ({
      id: `curveLines:${index}`,
      type: ShapeType.CurveLine,
      lines: curveLine,
      lineWidth: 1,
    }));

    const renderShapes: Shape[] = [
      ...curveLines,
      ...(eraserRef.current ? [eraserRef.current] : []),
    ];
    sketchCanvasProvider.setShapes(renderShapes);
    sketchCanvasProvider.reRender();
  }, [dataFrame]);

  return (
    <SketchCanvas
      id="sketch"
      provider={sketchCanvasProvider}
      className="absolute left-0 top-0 z-10 h-full w-full"
      style={{ pointerEvents: isActive ? "auto" : "none" }}
      handleStartDraw={(x, y, pressure) => {
        if (sketchMode === "pencil") {
          handleStartDraw(x, y, pressure);
        } else {
          handleStartErase(x, y);
        }
      }}
      handleMoveDraw={(x, y, pressure) => {
        if (sketchMode === "pencil") {
          handleMoveDraw(x, y, pressure);
        } else {
          handleMoveErase(x, y);
        }
      }}
      handleEndDraw={() => {
        if (sketchMode === "pencil") {
          handleEndDraw();
        } else {
          handleEndErase();
        }
      }}
    />
  );
}

export default CardEditorSketchPanel;
