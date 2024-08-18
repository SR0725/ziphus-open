import type { SpaceCard } from "@/application/domain/model/space";
import { type SaveSpaceCardPort } from "../out/save-space-card-port";
import { LoadSpaceCardPort } from "../out/load-space-card-port";
import { LoadSpacePort } from "../out/load-space-port";

export type LinkSpaceCardRemoveUseCaseConstructor = (
  loadSpace: LoadSpacePort,
  loadSpaceCard: LoadSpaceCardPort,
  saveSpaceCard: SaveSpaceCardPort
) => LinkSpaceCardRemoveUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type LinkSpaceCardRemoveUseCase = (props: {
  accountId?: string;
  spaceId: string;
  targetSpaceCardId: string;
  linkLineId: string;
}) => Promise<SpaceCard>;
