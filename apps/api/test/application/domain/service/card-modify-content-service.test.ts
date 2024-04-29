import cardModifyContentUseCaseConstructor from "@/application/domain/service/card-modify-content-service";
import { type CardModifyContentUseCaseConstructor } from "@/application/port/in/card-modify-content-use-case";
import type { LoadCardPort } from "@/application/port/out/load-card-port";
import type { SaveCardPort } from "@/application/port/out/save-card-port";
import type { EmitSocketPort } from "@/application/port/out/emit-socket-port";
import { CardPermission } from "@/application/domain/model/card";
import { createExampleAccount, createExampleCard } from "./create-example-data";

describe("CardModifyContentUseCase", () => {
  let cardModifyContentUseCase: ReturnType<CardModifyContentUseCaseConstructor>;
  let loadCardMock: jest.Mock<ReturnType<LoadCardPort>>;
  let saveCardMock: jest.Mock<ReturnType<SaveCardPort>>;

  beforeEach(() => {
    loadCardMock = jest.fn();
    saveCardMock = jest.fn();
    cardModifyContentUseCase = cardModifyContentUseCaseConstructor(
      loadCardMock,
      saveCardMock
    );
  });

  it(`
    Given an card content modify by card owner
    When modify a card content
    Then it should return true
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      content: "Hello, I am a Ray",
    };
    loadCardMock.mockResolvedValue(exampleCard);
    saveCardMock.mockResolvedValue(undefined);

    await cardModifyContentUseCase({
      accountId: exampleAccount.id,
      cardId: exampleCard.id,
      content: "Hello, I am a Cat",
    });

    expect(loadCardMock).toHaveBeenCalledWith({
      id: exampleCard.id,
    });
    expect(saveCardMock).toHaveBeenCalledWith({
      ...exampleCard,
      content: "Hello, I am a Cat",
    });
  });

  it(`
    Given an card content modify by other account but card is public editable
    When modify a card content
    Then it should return true
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      content: "Hello, I am a Ray",
      permission: CardPermission.PublicEditable,
    };
    loadCardMock.mockResolvedValue(exampleCard);
    saveCardMock.mockResolvedValue(undefined);

    await cardModifyContentUseCase({
      accountId: "other-account-id",
      cardId: exampleCard.id,
      content: "Hello, I am a Cat",
    });

    expect(loadCardMock).toHaveBeenCalledWith({
      id: exampleCard.id,
    });
    expect(saveCardMock).toHaveBeenCalledWith({
      ...exampleCard,
      content: "Hello, I am a Cat",
    });
  });

  it(`
    Given an card content modify by other account and card is not public editable
    When modify a card content
    Then it should throw an error
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      content: "Hello, I am a Ray",
      permission: CardPermission.Private,
    };
    loadCardMock.mockResolvedValue(exampleCard);
    saveCardMock.mockResolvedValue(undefined);

    await expect(
      cardModifyContentUseCase({
        accountId: "other-account-id",
        cardId: exampleCard.id,
        content: "Hello, I am a Cat",
      })
    ).rejects.toThrow();
  });
});
