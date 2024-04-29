import cardGetByIdUseCaseConstructor from "@/application/domain/service/card-get-by-id-service";
import { type CardGetByIdUseCaseConstructor } from "@/application/port/in/card-get-by-id-use-case";
import type { LoadCardPort } from "@/application/port/out/load-card-port";
import { CardPermission } from "@/application/domain/model/card";
import { createExampleAccount, createExampleCard } from "./create-example-data";

describe("CardGetByIdUseCase", () => {
  let cardCreateUseCase: ReturnType<CardGetByIdUseCaseConstructor>;
  let loadCardPort: jest.Mock<ReturnType<LoadCardPort>>;

  beforeEach(() => {
    loadCardPort = jest.fn();
    cardCreateUseCase = cardGetByIdUseCaseConstructor(loadCardPort);
  });

  it(`
    Given a existing card id and card owner account id
    When get a card
    Then it should return the card
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = createExampleCard(exampleAccount.id);
    loadCardPort.mockResolvedValue(exampleCard);
    const result = await cardCreateUseCase({
      cardId: exampleCard.id,
      accountId: exampleAccount.id,
    });
    expect(result).toEqual(exampleCard);
  });

  it(`
    Given a existing card id and other account id but card permission is public
    When get a card
    Then it should return the card
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      permission: CardPermission.PublicReadOnly,
    };
    loadCardPort.mockResolvedValue(exampleCard);
    const result = await cardCreateUseCase({
      cardId: exampleCard.id,
      accountId: "other-account-id",
    });
    expect(result).toEqual(exampleCard);
  });

  it(`
    Given a existing card id and other account id but card permission is private
    When get a card
    Then it should throw an error
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      permission: CardPermission.Private,
    };
    loadCardPort.mockResolvedValue(exampleCard);
    await expect(
      cardCreateUseCase({
        cardId: exampleCard.id,
        accountId: "other-account-id",
      })
    ).rejects.toThrow("Card not found");
  });

  it(`
    Given a existing card id and no account id but card permission is public
    When get a card
    Then it should return the card
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      permission: CardPermission.PublicReadOnly,
    };
    loadCardPort.mockResolvedValue(exampleCard);
    const result = await cardCreateUseCase({
      cardId: exampleCard.id,
    });
    expect(result).toEqual(exampleCard);
  });

  it(`
    Given a existing card id and no account id but card permission is private
    When get a card
    Then it should throw an error
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = {
      ...createExampleCard(exampleAccount.id),
      permission: CardPermission.Private,
    };
    loadCardPort.mockResolvedValue(exampleCard);
    await expect(
      cardCreateUseCase({
        cardId: exampleCard.id,
      })
    ).rejects.toThrow("Card not found");
  });

  it(`
    Given a non existing card id
    When get a card
    Then it should throw an error
  `, async () => {
    loadCardPort.mockResolvedValue(null);
    await expect(
      cardCreateUseCase({
        cardId: "non-existing-card-id",
      })
    ).rejects.toThrow("Card not found");
  });
});
