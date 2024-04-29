import { randomUUID } from "node:crypto";
import { type AccountLoginWithEmailUseCaseConstructor } from "@/application/port/in/account-login-with-email-use-case";
import { signToken } from "@/common/jwt-token";
import hash from "@/common/hash";
import type AccountTokenInterface from "@/application/port/in/account-token-interface";

const accountLoginWithEmailUseCaseConstructor: AccountLoginWithEmailUseCaseConstructor =

    (loadAccount) =>
    async ({ email, password }) => {
      const existingAccount = await loadAccount({ email });
      if (!existingAccount) {
        throw new Error("Account not found");
      }

      const hashedPassword = await hash(password);

      if (existingAccount.hashedPassword !== hashedPassword) {
        throw new Error("Invalid password");
      }

      return signToken<AccountTokenInterface>({
        id: randomUUID(),
        accountId: existingAccount.id,
        name: existingAccount.name,
        email: existingAccount.email,
      });
    };

export default accountLoginWithEmailUseCaseConstructor;
