import Account from "@/application/domain/model/account";
import accountLoginWithEmailUseCaseConstructor from "@/application/domain/service/account-login-with-email-service";
import { type AccountLoginWithEmailUseCaseConstructor } from "@/application/port/in/account-login-with-email-use-case";
import type { LoadAccountPort } from "@/application/port/out/load-account-port";
import hash from "@/common/hash";
import { decodeToken } from "@/common/jwt-token";
import { examplePassword, createExampleAccount } from "./create-example-data";

describe("AccountLoginWithEmailUseCase", () => {
  let accountLoginWithEmailUseCase: ReturnType<AccountLoginWithEmailUseCaseConstructor>;
  let loadAccountMock: jest.Mock<ReturnType<LoadAccountPort>>;

  beforeEach(() => {
    loadAccountMock = jest.fn();
    accountLoginWithEmailUseCase =
      accountLoginWithEmailUseCaseConstructor(loadAccountMock);
  });

  it(`
    Given an existing account
    When login with correct email and password
    Then it should return a login token
  `, async () => {
    const existingAccount = await createExampleAccount();
    loadAccountMock.mockResolvedValueOnce(existingAccount);

    const loginToken = await accountLoginWithEmailUseCase({
      email: existingAccount.email,
      password: examplePassword,
    });
    const decodedToken = decodeToken(loginToken);

    expect(loginToken).toEqual(expect.any(String));
    expect(decodedToken).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        accountId: existingAccount.id,
        name: existingAccount.name,
        email: existingAccount.email,
      })
    );
  });

  it(`
    Given an existing account
    When login with wrong password
    Then it should throw an error
  `, async () => {
    const existingAccount = await createExampleAccount();
    loadAccountMock.mockResolvedValueOnce(existingAccount);

    await expect(
      accountLoginWithEmailUseCase({
        email: existingAccount.email,
        password: "wrong-password",
      })
    ).rejects.toThrow("Invalid password");
  });

  it(`
    Given a non-existing account
    When login with email
    Then it should throw an error
  `, async () => {
    loadAccountMock.mockResolvedValueOnce(null);

    await expect(
      accountLoginWithEmailUseCase({
        email: "test@example.com",
        password: "wrong-password",
      })
    ).rejects.toThrow("Account not found");
  });
});
