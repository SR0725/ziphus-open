import { Circle } from '../models/shapes';

const drawCircle = (ctx: CanvasRenderingContext2D, dot: Circle) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
  if (dot.fillStyle) {
    ctx.fillStyle = dot.fillStyle;
    ctx.fill();
  }
  if (dot.strokeStyle) {
    ctx.strokeStyle = dot.strokeStyle;
    ctx.lineWidth = dot.lineWidth;
    ctx.stroke();
  }
  ctx.closePath();
  ctx.restore();
};

export default drawCircle;
