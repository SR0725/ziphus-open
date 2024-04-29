import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveAccountPort } from "../out/save-account-port";

export type AccountLoginWithEmailUseCaseConstructor = (loadAccount: LoadAccountPort) => AccountLoginWithEmailUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type AccountLoginWithEmailUseCase = (props: { email: string; password: string }) => Promise<string>;
