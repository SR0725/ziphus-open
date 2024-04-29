import type { SpaceCard } from "@/application/domain/model/space";
import { type SaveSpaceCardPort } from "../out/save-space-card-port";
import type { LoadSpacePort } from "../out/load-space-port";

export type SpaceCardCreateUseCaseConstructor = (
  loadSpace: LoadSpacePort,
  saveSpaceCard: SaveSpaceCardPort
) => SpaceCardCreateUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type SpaceCardCreateUseCase = (props: {
  accountId?: string;
  targetCardId: string;
  targetSpaceId: string;
  x: number;
  y: number;
}) => Promise<SpaceCard>;
