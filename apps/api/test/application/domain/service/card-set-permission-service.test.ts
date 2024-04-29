import type { LoadCardPort } from "@/application/port/out/load-card-port";
import type { SaveCardPort } from "@/application/port/out/save-card-port";
import { CardPermission } from "@/application/domain/model/card";
import { type CardModifyPermissionUseCaseConstructor } from "@/application/port/in/card-modify-permission-use-case";
import cardModifyPermissionUseCaseConstructor from "@/application/domain/service/card-modify-permission-service";
import { createExampleAccount, createExampleCard } from "./create-example-data";

describe("CardModifyPermissionUseCase", () => {
  let cardSetPermissionUseCase: ReturnType<CardModifyPermissionUseCaseConstructor>;
  let loadCardPort: jest.Mock<ReturnType<LoadCardPort>>;
  let saveCardPort: jest.Mock<ReturnType<SaveCardPort>>;

  beforeEach(() => {
    loadCardPort = jest.fn();
    saveCardPort = jest.fn();
    cardSetPermissionUseCase = cardModifyPermissionUseCaseConstructor(
      loadCardPort,
      saveCardPort
    );
  });

  it(`
    Given a existing card id and card owner account id 
    When set permission
    Then it should return true
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = createExampleCard(exampleAccount.id);
    loadCardPort.mockResolvedValue(exampleCard);
    saveCardPort.mockResolvedValue(undefined);
    const result = await cardSetPermissionUseCase({
      accountId: exampleAccount.id,
      cardId: exampleCard.id,
      permission: CardPermission.PublicEditable,
    });
    expect(result).toEqual(true);
  });

  it(`
    Given a non-existing card id
    When set permission
    Then it should throw an error
  `, async () => {
    const exampleAccount = await createExampleAccount();
    loadCardPort.mockResolvedValue(null);
    const result = cardSetPermissionUseCase({
      accountId: exampleAccount.id,
      cardId: "non-existing-card-id",
      permission: CardPermission.PublicEditable,
    });
    await expect(result).rejects.toThrow();
  });

  it(`
    Given a existing card id but not owner account id
    When set permission
    Then it should throw an error
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard = createExampleCard("another-account-id");
    loadCardPort.mockResolvedValue(exampleCard);
    const result = cardSetPermissionUseCase({
      accountId: exampleAccount.id,
      cardId: exampleCard.id,
      permission: CardPermission.PublicEditable,
    });
    await expect(result).rejects.toThrow();
  });
});
