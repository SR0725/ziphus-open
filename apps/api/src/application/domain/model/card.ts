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
class Card {
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
    readonly drawings: Stroke[],
    readonly images: Image[],
    readonly type: CardType,
    readonly llmDataUseHistory: LLMData[] | null,
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null
  ) {}
}

export default Card;
