import { randomUUID } from "node:crypto";
import { type SpaceCardGenerateWithMarkdownUseCaseConstructor } from "@/application/port/in/space-card-generate-with-markdown-use-case";
import Card, { CardType } from "../model/card";
import { SpaceCard, SpacePermission } from "../model/space";
import {
  DEFAULT_CARD_HEIGHT,
  DEFAULT_CARD_PERMISSION,
  DEFAULT_CARD_WIDTH,
} from "./card-create-service";
import showdown from "showdown";

const converter = new showdown.Converter();
const spaceCardGenerateWithMarkdownUseCaseConstructor: SpaceCardGenerateWithMarkdownUseCaseConstructor =

    (loadSpace, saveSpaceCards, saveCards) =>
    async ({ accountId, spaceId, markdown }) => {
      const existingSpace = await loadSpace({ id: spaceId });
      if (!existingSpace) {
        throw new Error("Space not found");
      }
      if (
        existingSpace?.permission !== SpacePermission.PublicEditable &&
        existingSpace?.belongAccountId !== accountId
      ) {
        throw new Error("Permission denied");
      }

      const cards = markdown.map((markdown, index) => {
        const cardTitle = markdown.match(/^# (.*)$/m)?.[1] ?? "";
        const card = new Card(
          randomUUID(),
          existingSpace.belongAccountId,
          DEFAULT_CARD_PERMISSION,
          cardTitle,
          converter.makeHtml(markdown),
          markdown,
          DEFAULT_CARD_WIDTH,
          DEFAULT_CARD_HEIGHT,
          true,
          [],
          [],
          CardType.book,
          null,
          new Date().toISOString(),
          new Date().toISOString(),
          null
        );
        return card;
      });

      const spaceCards = cards.map((card, index) => {
        const spaceCard = new SpaceCard(
          randomUUID(),
          card.id,
          existingSpace.id,
          (index % 30) * (DEFAULT_CARD_WIDTH + 120),
          Math.floor(index / 30) * (DEFAULT_CARD_HEIGHT + 1800),
          []
        );
        return spaceCard;
      });

      // Save cards
      await saveCards(cards);
      // Save space cards
      await saveSpaceCards(spaceCards);

      return spaceCards;
    };

export default spaceCardGenerateWithMarkdownUseCaseConstructor;
