import { randomUUID } from "node:crypto";
import { signToken } from "@/common/jwt-token";
import { type AccountRegisterUseCaseConstructor } from "@/application/port/in/account-register-use-case";
import hash from "@/common/hash";
import type AccountTokenInterface from "@/application/port/in/account-token-interface";
import Account from "../model/account";

const accountRegisterUseCaseConstructor: AccountRegisterUseCaseConstructor =
  (loadAccount, saveAccount) =>
  async ({ googleId = null, email, name, password }) => {
    const existingAccount = await loadAccount({ email });
    if (existingAccount) {
      throw new Error("Account already exists");
    }

    const hashedPassword = await hash(password);

    const account = new Account(
      randomUUID(),
      googleId,
      email,
      name,
      hashedPassword,
      new Date().toISOString(),
      new Date().toISOString(),
      null
    );

    await saveAccount(account);

    return signToken<AccountTokenInterface>({
      id: randomUUID(),
      accountId: account.id,
      name: account.name,
      email: account.email,
    });
  };

export default accountRegisterUseCaseConstructor;
