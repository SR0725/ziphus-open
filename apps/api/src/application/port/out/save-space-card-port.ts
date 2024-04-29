import type { SpaceCard } from "@/application/domain/model/space";

export type SaveSpaceCardPort = (
  spaceCard: SpaceCard,
  needRealTime?: boolean
) => Promise<void>;
