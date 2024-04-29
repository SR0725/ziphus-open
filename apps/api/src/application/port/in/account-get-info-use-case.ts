import type Account from "@/application/domain/model/account";
import { type LoadAccountPort } from "../out/load-account-port";

export type AccountGetInfoUseCaseConstructor = (loadAccount: LoadAccountPort) => AccountGetInfoUseCase;

export type AccountGetInfoUseCase = (props: { accountId: string }) => Promise<Account>;
