import { useState } from "react";
import {
  EditMode,
  EraserInfo,
  PencilInfo,
  SketchMode,
} from "@/components/card/card-editor-sketch-panel";

const useCanvasEditor = () => {
  const [editMode, setEditMode] = useState<EditMode>("text");
  const [sketchMode, setSketchMode] = useState<SketchMode>("pencil");
  const [pencilInfo, setPencilInfo] = useState<PencilInfo>({
    pencilColor: "white",
    pencilSize: 8,
  });
  const [isUseApplePencil, setIsUseApplePencil] = useState(false);
  const [eraserInfo, setEraserInfo] = useState<EraserInfo>({
    eraserSize: 16,
  });

  return {
    editMode,
    setEditMode,
    isUseApplePencil,
    setIsUseApplePencil,
    sketchMode,
    setSketchMode,
    pencilInfo,
    setPencilInfo,
    eraserInfo,
    setEraserInfo,
  };
};

export default useCanvasEditor;
