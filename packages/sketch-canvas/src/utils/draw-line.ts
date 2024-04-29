import { Line } from "../models/shapes";

const drawLine = (ctx: CanvasRenderingContext2D, line: Line) => {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(line.startX, line.startY);
  ctx.lineTo(line.endX, line.endY);
  ctx.lineWidth = line.lineWidth;
  if (line.fillStyle) {
    ctx.fillStyle = line.fillStyle;
    ctx.fill();
  }
  if (line.strokeStyle) {
    ctx.strokeStyle = line.strokeStyle;
    ctx.stroke();
  }
  ctx.closePath();
  ctx.restore();
};

export default drawLine;
