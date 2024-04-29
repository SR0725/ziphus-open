import cardAccessEditValidatorUseCaseConstructor from "@/application/domain/service/card-access-edit-validator-service";
import { type CardAccessEditValidatorUseCaseConstructor } from "@/application/port/in/card-access-edit-validator-use-case";
import type { LoadCardPort } from "@/application/port/out/load-card-port";
import type { SaveCardPort } from "@/application/port/out/save-card-port";
import type { EmitSocketPort } from "@/application/port/out/emit-socket-port";
import { CardPermission } from "@/application/domain/model/card";
import { createExampleAccount, createExampleCard } from "./create-example-data";

describe("CardAccessEditValidatorUseCase", () => {
  let cardAccessEditValidatorUseCase: ReturnType<CardAccessEditValidatorUseCaseConstructor>;
  let loadCardMock: jest.Mock<ReturnType<LoadCardPort>>;

  beforeEach(() => {
    loadCardMock = jest.fn();
    cardAccessEditValidatorUseCase =
      cardAccessEditValidatorUseCaseConstructor(loadCardMock);
  });

  it(`
    Given an card and card owner
    When try to access edit permission 
    Then it should return true
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      permission: CardPermission.Private,
    };
    loadCardMock.mockResolvedValue(exampleCard);

    const result = await cardAccessEditValidatorUseCase({
      accountId: exampleAccount.id,
      cardId: exampleCard.id,
    });

    expect(result).toEqual({
      available: true,
    });
  });

  it(`
    Given an card and other account but without edit permission
    When try to access edit permission 
    Then it should return false
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      permission: CardPermission.PublicReadOnly,
    };
    loadCardMock.mockResolvedValue(exampleCard);

    const result = await cardAccessEditValidatorUseCase({
      accountId: "other-account-id",
      cardId: exampleCard.id,
    });

    expect(result).toEqual({
      available: false,
    });
  });

  it(`
    Given an card and no account with edit permission
    When try to access edit permission 
    Then it should return true
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      permission: CardPermission.PublicEditable,
    };
    loadCardMock.mockResolvedValue(exampleCard);

    const result = await cardAccessEditValidatorUseCase({
      accountId: undefined,
      cardId: exampleCard.id,
    });

    expect(result).toEqual({
      available: true,
    });
  });
});
