export class Account {
  constructor(
    readonly id: string,
    readonly googleId: string | null,
    readonly email: string,
    readonly name: string,
    readonly hashedPassword: string,
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null
  ) {}
}

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

export class Illustration {
  constructor(
    readonly id: string,
    readonly image: string,
    readonly width: number,
    readonly height: number,
    readonly positionX: string,
    readonly positionY: string
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

export enum CardType {
  note = "note",
  book = "book",
  outline = "outline",
}

export class LLMData {
  constructor(
    readonly id: string,
    readonly description: string,
    readonly prompt: string,
    readonly input: string,
    readonly model: string,
    readonly completion: string,
    readonly cost: number,
    readonly useTime: number,
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null
  ) {}
}
export class Card {
  constructor(
    readonly id: string,
    readonly belongAccountId: string,
    readonly permission: CardPermission,
    readonly title: string,
    readonly snapshotContent: string,
    readonly modifyContent: string,
    readonly width: number,
    readonly height: number,
    readonly isSizeFitContent: boolean,
    readonly images: Image[],
    readonly drawings: Stroke[],
    readonly type: CardType,
    readonly llmDataUseHistory: LLMData[] | null,
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null
  ) {}
}

export enum SpacePermission {
  Private = "Private",
  PublicReadOnly = "PublicReadOnly",
  PublicEditable = "PublicEditable",
}

export enum LineType {
  Straight = "Straight",
  Curve = "Curve",
}

export enum LinkDirection {
  top = "top",
  bottom = "bottom",
  left = "left",
  right = "right",
}

class LinkLine {
  constructor(
    readonly id: string,
    readonly startCardDirection: LinkDirection,
    readonly endCardDirection: LinkDirection,
    readonly lineType: LineType,
    readonly startCardId: string,
    readonly endCardId: string,
    readonly startCardX: number,
    readonly startCardY: number,
    readonly endCardX: number,
    readonly endCardY: number,
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null
  ) {}
}

export class SpaceCard {
  constructor(
    readonly id: string,
    readonly targetCardId: string,
    readonly targetSpaceId: string,
    readonly x: number,
    readonly y: number,
    readonly linkLines: LinkLine[]
  ) {}
}

export class ChildSpace {
  constructor(
    readonly id: string,
    readonly targetSpaceId: string,
    readonly x: number,
    readonly y: number
  ) {}
}

export class Space {
  constructor(
    readonly id: string,
    readonly belongAccountId: string,
    readonly title: string,
    readonly permission: SpacePermission,
    readonly layers: string[],
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null
  ) {}
}
