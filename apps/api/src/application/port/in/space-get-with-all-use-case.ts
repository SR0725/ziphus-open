import type Space from "@/application/domain/model/space";
import type { LoadSpaceListPort } from "../out/load-space-list-port";

export type SpaceGetWithAllUseCaseConstructor = (
  loadSpaceList: LoadSpaceListPort
) => SpaceGetWithAllUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type SpaceGetWithAllUseCase = (props: {
  accountId: string;
}) => Promise<Space[]>;
