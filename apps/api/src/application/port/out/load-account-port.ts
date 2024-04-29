import type Account from "@/application/domain/model/account";

export type LoadAccountPort = (where: Partial<Account>) => Promise<Account | null>;
