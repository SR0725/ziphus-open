import accountRegisterUseCaseConstructor from "@/application/domain/service/account-register-service";
import { type AccountRegisterUseCaseConstructor } from "@/application/port/in/account-register-use-case";
import type { LoadAccountPort } from "@/application/port/out/load-account-port";
import type { SaveAccountPort } from "@/application/port/out/save-account-port";
import { decodeToken } from "@/common/jwt-token";
import { examplePassword, createExampleAccount } from "./create-example-data";

describe("AccountRegisterUseCase", () => {
  let accountRegisterUseCase: ReturnType<AccountRegisterUseCaseConstructor>;
  let loadAccountMock: jest.Mock<ReturnType<LoadAccountPort>>;
  let saveAccountMock: jest.Mock<ReturnType<SaveAccountPort>>;

  beforeEach(() => {
    loadAccountMock = jest.fn();
    saveAccountMock = jest.fn();
    accountRegisterUseCase = accountRegisterUseCaseConstructor(
      loadAccountMock,
      saveAccountMock
    );
  });

  it(`
    Given an existing account
    When register with the same email
    Then it should throw an error
  `, async () => {
    const existingAccount = await createExampleAccount();
    loadAccountMock.mockResolvedValueOnce(existingAccount);

    await expect(
      accountRegisterUseCase({
        googleId: existingAccount.googleId,
        email: existingAccount.email,
        name: existingAccount.name,
        password: examplePassword,
      })
    ).rejects.toThrow("Account already exists");
  });

  it(`
    Given a new account
    When register with the new email
    Then it should return a login token
  `, async () => {
    loadAccountMock.mockResolvedValueOnce(null);
    saveAccountMock.mockResolvedValueOnce(undefined);

    const exampleAccount = await createExampleAccount();

    const loginToken = await accountRegisterUseCase({
      googleId: exampleAccount.googleId,
      email: exampleAccount.email,
      name: exampleAccount.name,
      password: examplePassword,
    });

    expect(loadAccountMock).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(saveAccountMock).toHaveBeenCalledWith(
      expect.objectContaining({
        googleId: exampleAccount.googleId,
        email: exampleAccount.email,
        name: exampleAccount.name,
      })
    );

    const decodedToken = decodeToken(loginToken);
    expect(loginToken).toBeDefined();
    expect(decodedToken).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        accountId: expect.any(String),
        name: exampleAccount.name,
        email: exampleAccount.email,
      })
    );
  });
});
