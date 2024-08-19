import { randomUUID } from "node:crypto";
import { type SpaceCreateWithBookUseCaseConstructor } from "@/application/port/in/space-create-with-book-use-case";
import Space, { SpaceCard, SpacePermission } from "../model/space";
import {
  DEFAULT_CARD_HEIGHT,
  DEFAULT_CARD_PERMISSION,
  DEFAULT_CARD_WIDTH,
} from "./card-create-service";
import Card, { CardType } from "../model/card";
import spaceCreateWithBookCreateOutline from "./space-create-with-book-service-create-outline";
import { parseMarkdownToLevel } from "@/common/markdown-split";
import showdown from "showdown";

const converter = new showdown.Converter();

const spaceCreateWithBookUseCaseConstructor: SpaceCreateWithBookUseCaseConstructor =

    (loadAccount, saveSpace, saveSpaceCards, saveCards, chatWithLLM) =>
    async ({ accountId, pagesMarkdown, developerSetting }) => {
      console.log("spaceCreateWithBookUseCaseConstructor");
      console.log("developerSetting", developerSetting);
      // 確認帳號存在
      const existingAccount = await loadAccount({ id: accountId });
      if (!existingAccount) {
        throw new Error("Unauthorized or Account not found");
      }

      // 創建空間
      const newSpace = new Space(
        randomUUID(),
        accountId,
        "New Space",
        SpacePermission.PublicEditable,
        [],
        new Date().toISOString(),
        new Date().toISOString(),
        null
      );

      // 創建卡片
      const cards = pagesMarkdown.map((markdown, index) => {
        const cardContentLevelSection = parseMarkdownToLevel(markdown);

        const card = new Card(
          randomUUID(),
          newSpace.belongAccountId,
          DEFAULT_CARD_PERMISSION,
          cardContentLevelSection[0]?.content ?? "",
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

      // 創建空間卡片
      const spaceCards = cards.map((card, index) => {
        const spaceCard = new SpaceCard(
          randomUUID(),
          card.id,
          newSpace.id,
          (index % 30) * (DEFAULT_CARD_WIDTH + 120),
          Math.floor(index / 30) * (DEFAULT_CARD_HEIGHT + 1800),
          []
        );
        return spaceCard;
      });

      // 儲存空間
      await saveSpace(newSpace);
      // 儲存卡片
      await saveCards([...cards]);
      // 儲存空間卡片
      await saveSpaceCards([...spaceCards]);
      return newSpace;
    };

export default spaceCreateWithBookUseCaseConstructor;
