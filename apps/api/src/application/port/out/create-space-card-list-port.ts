import type { SpaceCard } from "@/application/domain/model/space";

export type CreateSpaceCardListPort = (
  spaceCards: SpaceCard[]
) => Promise<void>;
