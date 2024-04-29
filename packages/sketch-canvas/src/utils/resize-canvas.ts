function resizeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

export default resizeCanvas;