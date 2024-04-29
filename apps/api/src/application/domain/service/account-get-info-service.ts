import { type AccountGetInfoUseCaseConstructor } from "@/application/port/in/account-get-info-use-case";

const accountGetInfoUseCaseConstructor: AccountGetInfoUseCaseConstructor =
  (loadAccount) =>
  async ({ accountId }) => {
    const existingAccount = await loadAccount({ id: accountId });
    if (!existingAccount) {
      throw new Error("Account not found");
    }

    return existingAccount;
  };

export default accountGetInfoUseCaseConstructor;
