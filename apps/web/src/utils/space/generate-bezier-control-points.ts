type Point = { x: number; y: number };

function generateBezierControlPoints(start: Point, end: Point): Point[] {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const controlPoint1: Point = { x: start.x + dx * 0.8, y: start.y + dy * 0.1 };
  const controlPoint2: Point = { x: end.x - dx * 0.8, y: end.y - dy * 0.1 };

  return [controlPoint1, controlPoint2];
}

export default generateBezierControlPoints;
