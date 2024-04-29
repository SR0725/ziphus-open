import type Card from "@/application/domain/model/card";
import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveCardPort } from "../out/save-card-port";

export type CardCreateUseCaseConstructor = (loadAccount: LoadAccountPort, saveCard: SaveCardPort) => CardCreateUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type CardCreateUseCase = (props: { accountId: string }) => Promise<Card>;
