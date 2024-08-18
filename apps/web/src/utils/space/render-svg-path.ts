import generateBezierControlPoints from "./generate-bezier-control-points";

type Point = { x: number; y: number };

function renderSvgPath(
  pathLineRef: React.RefObject<SVGPathElement>,
  svgBoxRef: React.RefObject<SVGSVGElement>,
  start: Point,
  end: Point
) {
  const vector = {
    x: end.x - start.x,
    y: end.y - start.y,
  };
  const width = Math.abs(vector.x);
  const height = Math.abs(vector.y);
  const startPoint = {
    x: 0,
    y: 0,
  };
  const endPoint = {
    x: width,
    y: height,
  };
  const controlPoints = generateBezierControlPoints(startPoint, endPoint);

  if (!pathLineRef.current) return;
  if (!svgBoxRef.current) return;

  pathLineRef.current.setAttribute(
    "d",
    `M ${startPoint.x} ${startPoint.y} C ${controlPoints[0]!.x} ${controlPoints[0]!.y}, ${controlPoints[1]!.x} ${controlPoints[1]!.y}, ${Math.abs(endPoint.x)} ${Math.abs(endPoint.y)}`
  );
  if (vector.x < 0 && vector.y < 0) {
    svgBoxRef.current.setAttribute("transform", "scale(-1, -1)");
  }
  if (vector.y < 0 && vector.x > 0) {
    svgBoxRef.current.setAttribute("transform", "scale(1, -1)");
  }
  if (vector.x < 0 && vector.y > 0) {
    svgBoxRef.current.setAttribute("transform", "scale(-1, 1)");
  }
  if (vector.x > 0 && vector.y > 0) {
    svgBoxRef.current.setAttribute("transform", "scale(1, 1)");
  }

  svgBoxRef.current.style.left = `${Math.min(end.x, start.x)}px`;
  svgBoxRef.current.style.top = `${Math.min(end.y, start.y)}px`;
  svgBoxRef.current.setAttribute("width", width.toString());
  svgBoxRef.current.setAttribute("height", height.toString());
}

export default renderSvgPath;
