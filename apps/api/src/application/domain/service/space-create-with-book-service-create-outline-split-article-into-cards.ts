import { randomUUID } from "crypto";
import { LineType, LinkDirection, LinkLine, SpaceCard } from "../model/space";
import Card, { CardType } from "../model/card";
import { DEFAULT_CARD_HEIGHT, DEFAULT_CARD_PERMISSION, DEFAULT_CARD_WIDTH } from "./card-create-service";

function findBestMatch(
  text: string,
  pattern: string,
  startFrom: number = 0
): number {
  const threshold = 0.75;
  let lastMatchIndex = -1;
  let lastMatchRatio = 0;

  for (let i = startFrom; i < text.length; i++) {
    let matchCount = 0;

    for (let j = 0; j < pattern.length; j++) {
      if (text.slice(i, i + pattern.length + 1).includes(pattern[j]!)) {
        matchCount++;
      }
    }
    const matchRatio = matchCount / pattern.length;
    if (matchRatio >= 0.999) {
      return i + 1;
    } else if (matchRatio >= threshold && matchRatio > lastMatchRatio) {
      lastMatchIndex = i + 1;
      lastMatchRatio = matchRatio;
    }
  }

  return lastMatchIndex;
}

interface CardGroup {
  spaceCard: SpaceCard;
  card: Card;
}


export default function splitArticleIntoCards(
  accountId: string,
  spaceId: string,
  snapshotSpaceCards: { id: string; markdown: string }[],
  text: string,
  cardFormat: string
): CardGroup[] {
  const cardGroups: CardGroup[] = [];
  const cardRegex = /<card>([\s\S]*?)<\/card>/g;
  let match;
  let index = 0;
  while ((match = cardRegex.exec(cardFormat)) !== null) {
    const cardContent = match[1];
    const titleRegex = /<title>([\s\S]*?)<\/title>/;
    const startRegex = /<start>([\s\S]*?)<\/start>/;
    const endRegex = /<end>([\s\S]*?)<\/end>/;

    const titleMatch = cardContent!.match(titleRegex);
    const startMatch = cardContent!.match(startRegex);
    const endMatch = cardContent!.match(endRegex);

    const title = titleMatch?.[1] ?? "";
    let content = "";
    let targetSpaceCardId: string | null = null;

    if (startMatch && endMatch) {
      const start = startMatch[1] ?? "";
      const end = endMatch[1] ?? "";


      const startIndex = findBestMatch(text, start);
      const endIndex = findBestMatch(text, end, startIndex);
      targetSpaceCardId = snapshotSpaceCards.find((snapshotSpaceCard) => {
        return findBestMatch(snapshotSpaceCard.markdown, start) !== -1;
      })?.id ?? null;

      if (startIndex !== -1 && endIndex !== -1) {
        content = text.slice(startIndex, endIndex + end.length);
      }
    }

    const card = new Card(
      randomUUID(),
      accountId,
      DEFAULT_CARD_PERMISSION,
      title,
      content,
      content,
      DEFAULT_CARD_WIDTH,
      DEFAULT_CARD_HEIGHT,
      true,
      [],
      [],
      CardType.outline,
      null,
      new Date().toISOString(),
      new Date().toISOString(),
      null
    );
    const spaceCardId = randomUUID();
    const spaceCard = new SpaceCard(
      spaceCardId,
      card.id,
      spaceId,
      index * (DEFAULT_CARD_WIDTH + 120),
      -1000,
      [
        new LinkLine(
          randomUUID(),
          LinkDirection.bottom,
          LinkDirection.top,
          LineType.Curve,
          spaceCardId,
          targetSpaceCardId ?? "",
          0,
          0,
          0,
          0,
          new Date().toISOString(),
          new Date().toISOString(),
          null
        ),
      ]
    );

    cardGroups.push({ spaceCard, card });

    index ++;
  }

  return cardGroups;
}
