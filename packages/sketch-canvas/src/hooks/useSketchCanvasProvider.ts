/* eslint-disable no-unused-vars */
import { useCallback, useRef, useState } from "react";
import { Shape } from "../models/shapes";


export interface SketchCanvasProviderSetting {
  isUseApplePencil: boolean;
}

export interface SketchCanvasProvider extends SketchCanvasProviderSetting {
  getShapes: () => Shape[];
  setShapes: (shapes: Shape[]) => void;
  addShape: (shape: Shape) => void;
  setShape: (id: string, shape: Shape) => void;
  removeShape: (id: string) => void;
  clear: () => void;
  reRender: () => void;
  frame: number;
}

export const useSketchCanvasProvider = ({ 
  isUseApplePencil,
}:SketchCanvasProviderSetting): SketchCanvasProvider => {
  const shapes = useRef<Shape[]>([]);
  const [frame, setFrame] = useState(0);

  const addShape = useCallback((shape: Shape) => {
    shapes.current.push(shape);
  }, []);

  const setShape = useCallback((id: string, newShape: Shape) => {
    shapes.current = shapes.current.map((shape) =>
      shape.id === id ? newShape : shape
    );
  }, []);

  const setShapes = useCallback((newShapes: Shape[]) => {
    shapes.current = newShapes;
  }, []);

  const getShapes = useCallback(() => shapes.current, []);

  const removeShape = useCallback((id: string) => {
    shapes.current = shapes.current.filter((shape) => shape.id !== id);
  }, []);

  const clear = useCallback(() => {
    shapes.current = [];
  }, []);

  const reRender = useCallback(() => {
    setFrame(frame + 1);
  }, [frame]);

  return {
    getShapes,
    setShapes,
    addShape,
    setShape,
    removeShape,
    clear,
    reRender,
    frame,
    isUseApplePencil
  };
};
