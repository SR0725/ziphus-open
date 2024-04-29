import type { LoadSpaceCardPort } from "../out/load-space-card-port";
import { type LoadSpacePort } from "../out/load-space-port";
import { type SaveSpacePort } from "../out/save-space-port";

export type SpaceCardUpdateLayerUseCaseConstructor = (
  loadSpaceCard: LoadSpaceCardPort,
  loadSpace: LoadSpacePort,
  saveSpace: SaveSpacePort
) => SpaceCardUpdateLayerUseCase;

export type SpaceCardUpdateLayerUseCase = (props: {
  accountId?: string;
  targetSpaceCardId: string;
  operation: "top" | "bottom" | "up" | "down";
}) => Promise<string[]>;
