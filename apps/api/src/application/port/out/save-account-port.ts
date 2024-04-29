import type Account from "@/application/domain/model/account";

export type SaveAccountPort = (account: Account) => Promise<void>;
