import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveAccountPort } from "../out/save-account-port";

export type AccountRegisterUseCaseConstructor = (
    loadAccount: LoadAccountPort,
    saveAccount: SaveAccountPort
  ) => AccountRegisterUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type AccountRegisterUseCase = (props: {
    googleId?: string | null | undefined;
    email: string;
    name: string;
    password: string;
  }) => Promise<string>;
