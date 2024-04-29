import type Space from "@/application/domain/model/space";
import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveSpacePort } from "../out/save-space-port";

export type SpaceCreateUseCaseConstructor = (loadAccount: LoadAccountPort, saveSpace: SaveSpacePort) => SpaceCreateUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type SpaceCreateUseCase = (props: { accountId: string }) => Promise<Space>;
