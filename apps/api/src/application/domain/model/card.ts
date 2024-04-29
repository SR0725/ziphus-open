export enum CardPermission {
  Private = "Private",
  PublicReadOnly = "PublicReadOnly",
  PublicEditable = "PublicEditable",
}

export class Stroke {
  constructor(
    readonly id: string,
    readonly lines: Line[]
  ) {}
}

export class Line {
  constructor(
    readonly strokeId: string,
    readonly color: string,
    readonly width: number,
    readonly startX: number,
    readonly startY: number,
    readonly endX: number,
    readonly endY: number
  ) {}
}

export class Image {
  constructor(
    readonly id: string,
    readonly url: string,
    readonly key: string,
    readonly bytes: number,
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null
  ) {}
}

class Card {
  constructor(
    readonly id: string,
    readonly belongAccountId: string,
    readonly permission: CardPermission,
    readonly title: string,
    readonly content: string,
    readonly width: number,
    readonly height: number,
    readonly isSizeFitContent: boolean,
    readonly drawings: Stroke[],
    readonly images: Image[],
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null
  ) {}
}

export default Card;
