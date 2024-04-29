import { randomUUID } from "node:crypto";
import { type CardCreateUseCaseConstructor } from "@/application/port/in/card-create-use-case";
import Card, { CardPermission } from "../model/card";

const DEFAULT_CARD_PERMISSION = CardPermission.PublicEditable;
const DEFAULT_CARD_WIDTH = 600;
const DEFAULT_CARD_HEIGHT = 800;

const cardCreateUseCaseConstructor: CardCreateUseCaseConstructor =
  (loadAccount, saveCard) =>
  async ({ accountId }) => {
    const existingAccount = await loadAccount({ id: accountId });
    if (!existingAccount) {
      throw new Error("Unauthorized or Account not found");
    }

    const newCard = new Card(
      randomUUID(),
      accountId,
      DEFAULT_CARD_PERMISSION,
      "",
      "",
      DEFAULT_CARD_WIDTH,
      DEFAULT_CARD_HEIGHT,
      true,
      [],
      [],
      new Date().toISOString(),
      new Date().toISOString(),
      null
    );

    await saveCard(newCard, true);

    return newCard;
  };

export default cardCreateUseCaseConstructor;
