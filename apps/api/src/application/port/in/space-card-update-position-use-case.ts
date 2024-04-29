import { type LoadSpacePort } from "../out/load-space-port";
import { type LoadSpaceCardPort } from "../out/load-space-card-port";
import { type SaveSpaceCardPort } from "../out/save-space-card-port";

export type SpaceCardUpdatePositionUseCaseConstructor = (
  loadSpace: LoadSpacePort,
  loadSpaceCard: LoadSpaceCardPort,
  saveSpaceCard: SaveSpaceCardPort
) => SpaceCardUpdatePositionUseCase;

export type SpaceCardUpdatePositionUseCase = (props: {
  accountId?: string;
  spaceCardId: string;
  x: number;
  y: number;
}) => Promise<boolean>;
