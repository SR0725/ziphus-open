export default class Line {
  constructor(
    public strokeId: string,
    public color: string,
    public width: number,
    public startX: number,
    public startY: number,
    public endX: number,
    public endY: number
  ) {}
}
