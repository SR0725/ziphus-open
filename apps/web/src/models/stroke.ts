import Line from "./line";

export default class Stroke {
  constructor(
    public id: string,
    public lines: Line[]
  ) {}
}
