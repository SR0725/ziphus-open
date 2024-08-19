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

export class LinkLine {
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

class Space {
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

export default Space;
