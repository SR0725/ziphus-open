import accountGetInfoUseCaseConstructor from "@/application/domain/service/account-get-info-service";
import { type AccountGetInfoUseCaseConstructor } from "@/application/port/in/account-get-info-use-case";
import type { LoadAccountPort } from "@/application/port/out/load-account-port";
import { createExampleAccount } from "./create-example-data";

describe("AccountGetInfoUseCase", () => {
  let accountGetInfoUseCase: ReturnType<AccountGetInfoUseCaseConstructor>;
  let loadAccountMock: jest.Mock<ReturnType<LoadAccountPort>>;

  beforeEach(() => {
    loadAccountMock = jest.fn();
    accountGetInfoUseCase = accountGetInfoUseCaseConstructor(loadAccountMock);
  });

  it(`
    Given an existing account
    When get info
    Then it should return the account
  `, async () => {
    const existingAccount = await createExampleAccount();
    loadAccountMock.mockResolvedValueOnce(existingAccount);

    const account = await accountGetInfoUseCase({
      accountId: existingAccount.id,
    });

    expect(loadAccountMock).toHaveBeenCalledWith({ id: existingAccount.id });
    expect(account).toEqual(existingAccount);
  });

  it(`
    Given an non existing account
    When get info
    Then it should throw an error
  `, async () => {
    loadAccountMock.mockResolvedValueOnce(null);

    await expect(
      accountGetInfoUseCase({ accountId: "non-existing-account-id" })
    ).rejects.toThrow("Account not found");
  });
});
