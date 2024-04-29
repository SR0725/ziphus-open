import { CurveLine } from "../models/shapes";

const drawCurveLine = (ctx: CanvasRenderingContext2D, curveLine: CurveLine) => {
  ctx.save();
  ctx.beginPath();

  // 設定起始點
  ctx.moveTo(curveLine.lines?.[0]?.startX || 0,curveLine.lines?.[0]?.startY || 0);

  // 繪製曲線
  for (let i = 0; i < curveLine.lines.length; i++) {
    const line = curveLine.lines[i]!;

    // 設定線段樣式
    if (line.strokeStyle) {
      ctx.strokeStyle = line.strokeStyle;
    }
    ctx.lineWidth = line.lineWidth;

    // 使用二次貝塞爾曲線繪製平滑曲線
    if (i < curveLine.lines.length - 1) {
      const nextLine = curveLine.lines[i + 1]!;
      const midX = (line.endX + nextLine.startX) / 2;
      const midY = (line.endY + nextLine.startY) / 2;
      ctx.quadraticCurveTo(line.endX, line.endY, midX, midY);
    } else {
      ctx.lineTo(line.endX, line.endY);
    }
  }

  // 繪製路徑
  ctx.stroke();
  ctx.restore();
};

export default drawCurveLine;
