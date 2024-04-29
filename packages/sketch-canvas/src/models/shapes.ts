/* eslint-disable no-unused-vars */
export enum ShapeType {
  Line = "Line",
  CurveLine = "CurveLine",
  Rect = "Rect",
  Circle = "Circle",
}

export interface Shape {
  id: string;
  type: ShapeType;
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth: number;
}

export interface Line extends Shape {
  type: ShapeType.Line;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
}

export interface CurveLine extends Shape {
  type: ShapeType.CurveLine;
  lines: Line[];
}

export interface Rect extends Shape {
  type: ShapeType.Rect;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle extends Shape {
  type: ShapeType.Circle;
  x: number;
  y: number;
  radius: number;
}
