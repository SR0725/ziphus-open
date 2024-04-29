export enum SpacePermission {
  Private = "Private",
  PublicReadOnly = "PublicReadOnly",
  PublicEditable = "PublicEditable",
}

export class SpaceCard {
  constructor(
    readonly id: string,
    readonly targetCardId: string,
    readonly targetSpaceId: string,
    readonly x: number,
    readonly y: number
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
