import type { SpaceCard } from "@/application/domain/model/space";
import type SpaceCardCombineTargetCard from "../in/space-card-combine-target-card";

export type LoadSpaceCardListPort = (
  where: Partial<SpaceCard>,
  option: {
    isCombineTargetCard: boolean;
  }
) => Promise<SpaceCardCombineTargetCard[] | null>;
