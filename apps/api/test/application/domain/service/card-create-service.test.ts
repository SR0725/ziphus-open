import { CardPermission } from "@/application/domain/model/card";
import cardCreateUseCaseConstructor from "@/application/domain/service/card-create-service";
import { type CardCreateUseCaseConstructor } from "@/application/port/in/card-create-use-case";
import type { LoadAccountPort } from "@/application/port/out/load-account-port";
import type { SaveCardPort } from "@/application/port/out/save-card-port";
import { createExampleAccount } from "./create-example-data";

describe("CardCreateUseCase", () => {
  let cardCreateUseCase: ReturnType<CardCreateUseCaseConstructor>;
  let loadAccountMock: jest.Mock<ReturnType<LoadAccountPort>>;
  let saveCardMock: jest.Mock<ReturnType<SaveCardPort>>;

  beforeEach(() => {
    loadAccountMock = jest.fn();
    saveCardMock = jest.fn();
    cardCreateUseCase = cardCreateUseCaseConstructor(
      loadAccountMock,
      saveCardMock
    );
  });

  it(`
    Given an existing account
    When create a card
    Then it should return a new card
  `, async () => {
    const existingAccount = await createExampleAccount();
    loadAccountMock.mockResolvedValueOnce(existingAccount);

    const newCard = await cardCreateUseCase({
      accountId: existingAccount.id,
    });

    expect(newCard).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        belongAccountId: existingAccount.id,
        permission: CardPermission.Private,
        width: 1280,
        height: 1280,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );

    expect(saveCardMock).toHaveBeenCalledWith(newCard);
  });

  it(`
    Given non existing account
    When create a card
    Then it should throw an error
  `, async () => {
    loadAccountMock.mockResolvedValueOnce(null);

    await expect(
      cardCreateUseCase({
        accountId: "non-existing-account-id",
      })
    ).rejects.toThrow("Account not found");
  });
});
