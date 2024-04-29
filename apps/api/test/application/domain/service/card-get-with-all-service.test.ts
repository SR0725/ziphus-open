import cardGetWithAllUseCaseConstructor from "@/application/domain/service/card-get-with-all-service";
import { type CardGetWithAllUseCaseConstructor } from "@/application/port/in/card-get-with-all-use-case";
import type { LoadCardListPort } from "@/application/port/out/load-card-list-port";
import { createExampleAccount, createExampleCard } from "./create-example-data";

describe("CardGetWithAllUseCase", () => {
  let cardCreateUseCase: ReturnType<CardGetWithAllUseCaseConstructor>;
  let loadCardListPort: jest.Mock<ReturnType<LoadCardListPort>>;

  beforeEach(() => {
    loadCardListPort = jest.fn();
    cardCreateUseCase = cardGetWithAllUseCaseConstructor(loadCardListPort);
  });

  it(`
    Given a existing account id
    When get all card
    Then it should return an array of cards
  `, async () => {
    const exampleAccount = await createExampleAccount();
    const exampleCard1 = createExampleCard(exampleAccount.id);
    const exampleCard2 = createExampleCard(exampleAccount.id);
    loadCardListPort.mockResolvedValue([exampleCard1, exampleCard2]);
    const result = await cardCreateUseCase({
      accountId: exampleAccount.id,
    });
    expect(result).toEqual([exampleCard1, exampleCard2]);
  });

  it(`
    Given a existing account id without cards
    When get all card
    Then it should return an array of cards
  `, async () => {
    const exampleAccount = await createExampleAccount();
    loadCardListPort.mockResolvedValue([]);
    const result = await cardCreateUseCase({
      accountId: exampleAccount.id,
    });
    expect(result).toEqual([]);
  });
});
