import { type LoadSpacePort } from "../out/load-space-port";
import { type LoadSpaceCardPort } from "../out/load-space-card-port";
import { type DeleteSpaceCardPort } from "../out/delete-space-card-port";

export type SpaceCardDeleteUseCaseConstructor = (
  loadSpace: LoadSpacePort,
  loadSpaceCard: LoadSpaceCardPort,
  deleteSpaceCard: DeleteSpaceCardPort
) => SpaceCardDeleteUseCase;

export type SpaceCardDeleteUseCase = (props: {
  accountId: string;
  spaceCardId: string;
}) => Promise<boolean>;
