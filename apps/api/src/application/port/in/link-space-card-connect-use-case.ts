import type {
  LinkDirection,
  SpaceCard,
} from "@/application/domain/model/space";
import { type SaveSpaceCardPort } from "../out/save-space-card-port";
import { LoadSpaceCardPort } from "../out/load-space-card-port";
import { LoadSpacePort } from "../out/load-space-port";

export type LinkSpaceCardConnectUseCaseConstructor = (
  loadSpace: LoadSpacePort,
  loadSpaceCard: LoadSpaceCardPort,
  saveSpaceCard: SaveSpaceCardPort
) => LinkSpaceCardConnectUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type LinkSpaceCardConnectUseCase = (props: {
  accountId?: string;
  spaceId: string;
  startSpaceCardId: string;
  endSpaceCardId: string;
  startSpaceCardDirection: LinkDirection;
  endSpaceCardDirection: LinkDirection;
}) => Promise<SpaceCard>;
