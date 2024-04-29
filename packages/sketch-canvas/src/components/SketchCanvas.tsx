/* eslint-disable no-unused-vars */
"use client";
import { useRef, useEffect } from "react";
import { SketchCanvasProvider } from "../hooks/useSketchCanvasProvider";
import { useResizeListener } from "../hooks/useResizeListener";
import drawCircle from "../utils/draw-circle";
import drawLine from "../utils/draw-line";
import { Circle, CurveLine, Line, ShapeType } from "../models/shapes";
import drawCurveLine from "../utils/draw-curve-line";

interface SketchCanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  provider: SketchCanvasProvider;
  handleStartDraw?: (x: number, y: number, pressure: number) => void;
  handleMoveDraw?: (x: number, y: number, pressure: number) => void;
  handleEndDraw?: () => void;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({
  provider,
  handleStartDraw,
  handleMoveDraw,
  handleEndDraw,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { getShapes, isUseApplePencil } = provider;
  const handleResize = useResizeListener(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      handleResize();

      getShapes().forEach((shape) => {
        if (shape.type === ShapeType.Line) {
          drawLine(ctx, shape as Line);
        } else if (shape.type === ShapeType.Circle) {
          drawCircle(ctx, shape as Circle);
        } else if (shape.type === ShapeType.CurveLine) {
          drawCurveLine(ctx, shape as CurveLine);
        }
      });
    }
  }, [getShapes()]);

  return (
    <canvas
      {...props}
      ref={canvasRef}
      onMouseDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x =
          ((event.clientX - rect.left) / rect.width) *
          (canvasRef.current?.offsetWidth || 0);
        const y =
          ((event.clientY - rect.top) / rect.height) *
          (canvasRef.current?.offsetHeight || 0);
        if (handleStartDraw) {
          handleStartDraw(x, y, 1);
        }
      }}
      onMouseMove={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x =
          ((event.clientX - rect.left) / rect.width) *
          (canvasRef.current?.offsetWidth || 0);
        const y =
          ((event.clientY - rect.top) / rect.height) *
          (canvasRef.current?.offsetHeight || 0);
        if (handleMoveDraw) {
          handleMoveDraw(x, y, 1);
        }
      }}
      onMouseUp={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        if (handleEndDraw) {
          handleEndDraw();
        }
      }}
      onTouchStart={(event) => {
        event.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        const touch = event.touches[0];
        if (!rect || !touch) return;

        const pressure = 1 + ((touch as any).force || 0) * 10;

        if (isUseApplePencil && pressure < 1.0001) {
          return;
        }
        const x =
          ((touch.clientX - rect.left) / rect.width) *
          (canvasRef.current?.offsetWidth || 0);
        const y =
          ((touch.clientY - rect.top) / rect.height) *
          (canvasRef.current?.offsetHeight || 0);

        if (handleStartDraw) {
          handleStartDraw(x, y, pressure);
        }
      }}
      onTouchMove={(event) => {
        event.preventDefault();
        const touch = event.touches[0];
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect || !touch) return;
        const pressure = 1 + ((touch as any).force || 0) * 5;

        if (isUseApplePencil && pressure < 1.0001) {
          return;
        }

        const x =
          ((touch.clientX - rect.left) / rect.width) *
          (canvasRef.current?.offsetWidth || 0);
        const y =
          ((touch.clientY - rect.top) / rect.height) *
          (canvasRef.current?.offsetHeight || 0);

        if (handleMoveDraw) {
          handleMoveDraw(x, y, pressure);
        }
      }}
      onTouchEnd={(event) => {
        event.preventDefault();
        if (handleEndDraw) {
          handleEndDraw();
        }
      }}
    />
  );
};
