interface Dot {
  x: number;
  y: number;
  size: number;
}

interface Line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
}

export default function isCircleTouchingWideLine(
  circle: Dot,
  line: Line
): boolean {
  const lineLength = Math.sqrt(
    (line.endX - line.startX) ** 2 + (line.endY - line.startY) ** 2
  );
  const normalized = {
    x: (line.endX - line.startX) / lineLength,
    y: (line.endY - line.startY) / lineLength,
  };
  const circleToLineStart = {
    x: circle.x - line.startX,
    y: circle.y - line.startY,
  };
  const projectionLength =
    circleToLineStart.x * normalized.x + circleToLineStart.y * normalized.y;

  let closestPoint: {
    x: number;
    y: number;
  };
  if (projectionLength < 0) {
    closestPoint = {
      x: line.startX,
      y: line.startY,
    };
  } else if (projectionLength > lineLength) {
    closestPoint = {
      x: line.endX,
      y: line.endY,
    };
  } else {
    closestPoint = {
      x: line.startX + projectionLength * normalized.x,
      y: line.startY + projectionLength * normalized.y,
    };
  }

  const distanceToLine = Math.sqrt(
    (circle.x - closestPoint.x) ** 2 + (circle.y - closestPoint.y) ** 2
  );
  return distanceToLine <= line.width / 2 + circle.size / 2;
}
