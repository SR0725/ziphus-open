import { randomUUID } from "node:crypto";
import { type CardCreateUseCaseConstructor } from "@/application/port/in/card-create-use-case";
import Card, { CardPermission, CardType } from "../model/card";
import showdown from "showdown";

const converter = new showdown.Converter();

export const DEFAULT_CARD_PERMISSION = CardPermission.PublicEditable;
export const DEFAULT_CARD_WIDTH = 600;
export const DEFAULT_CARD_HEIGHT = 128;

const cardCreateUseCaseConstructor: CardCreateUseCaseConstructor =
  (loadAccount, saveCard) =>
  async ({ accountId, initialContent }) => {
    const existingAccount = await loadAccount({ id: accountId });
    if (!existingAccount) {
      throw new Error("Unauthorized or Account not found");
    }

    const newCard = new Card(
      randomUUID(),
      accountId,
      DEFAULT_CARD_PERMISSION,
      "",
      converter.makeHtml(initialContent ?? ""),
      initialContent ?? "",
      DEFAULT_CARD_WIDTH,
      DEFAULT_CARD_HEIGHT,
      true,
      [],
      [],
      CardType.note,
      null,
      new Date().toISOString(),
      new Date().toISOString(),
      null
    );

    await saveCard(newCard, true);

    return newCard;
  };

export default cardCreateUseCaseConstructor;
