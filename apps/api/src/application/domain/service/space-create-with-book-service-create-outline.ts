import { ChatLLMPort } from "@/application/port/out/chat-llm-port";
import { SpaceCard } from "../model/space";
import Card from "../model/card";
import splitArticleIntoCards from "./space-create-with-book-service-create-outline-split-article-into-cards";
import generateCardOutline from "./space-create-with-book-service-create-outline-generate-outline";
import generateCardFormat from "./space-create-with-book-service-create-outline-generate-card-format";
import { LLMModel } from "@/application/port/in/llm-model";

interface SnapshotSpaceCard {
  id: string;
  markdown: string;
}

const spaceCreateWithBookCreateOutline = async ({
  accountId,
  spaceId,
  pagesMarkdown,
  snapshotSpaceCards,
  chatWithLLM,
  developerSetting,
}: {
  accountId: string;
  spaceId: string;
  pagesMarkdown: string[];
  snapshotSpaceCards: SnapshotSpaceCard[];
  chatWithLLM: ChatLLMPort;
  developerSetting?: {
    outlinePrompt?: string;
    splitCardPrompt?: string;
    useLLM?: LLMModel;
  };
}): Promise<
  {
    spaceCard: SpaceCard;
    card: Card;
  }[]
> => {
  // 取出文章大綱
  const [outlineResponse, outlineLLMdata] = await generateCardOutline(
    chatWithLLM,
    pagesMarkdown.join("\n"),
    developerSetting?.outlinePrompt,
    developerSetting?.useLLM
  );

  // 生成卡片格式
  const [cardFormatResponse, cardFormatLLMData] = await generateCardFormat(
    chatWithLLM,
    pagesMarkdown.join("\n"),
    outlineResponse,
    developerSetting?.splitCardPrompt,
    developerSetting?.useLLM
  );
  const cardFormat = cardFormatResponse.content;

  // 將文章分割成卡片
  const knowledgeCards = splitArticleIntoCards(
    accountId,
    spaceId,
    snapshotSpaceCards,
    pagesMarkdown.join("\n"),
    cardFormat
  );

  return knowledgeCards;
};

export default spaceCreateWithBookCreateOutline;
