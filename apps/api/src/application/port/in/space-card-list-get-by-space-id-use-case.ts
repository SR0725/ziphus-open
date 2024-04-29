import type { LoadSpaceCardListPort } from "../out/load-space-card-list-port";
import type { LoadSpacePort } from "../out/load-space-port";
import type SpaceCardCombineTargetCard from "./space-card-combine-target-card";

export type SpaceCardListGetBySpaceIdUseCaseConstructor = (
  loadSpace: LoadSpacePort,
  loadSpaceCardList: LoadSpaceCardListPort
) => SpaceCardListGetBySpaceIdUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type SpaceCardListGetBySpaceIdUseCase = (props: {
  accountId?: string;
  spaceId: string;
  isCombineTargetCard?: boolean;
}) => Promise<SpaceCardCombineTargetCard[]>;
