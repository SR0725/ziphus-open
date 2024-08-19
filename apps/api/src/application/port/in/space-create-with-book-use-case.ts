import type Space from "@/application/domain/model/space";
import { type LoadAccountPort } from "../out/load-account-port";
import { type SaveSpacePort } from "../out/save-space-port";
import { ChatLLMPort } from "../out/chat-llm-port";
import { CreateSpaceCardListPort } from "../out/create-space-card-list-port";
import { CreateCardListPort } from "../out/create-card-list-port";
import { LLMModel } from "./llm-model";

export type SpaceCreateWithBookUseCaseConstructor = (
  loadAccount: LoadAccountPort,
  saveSpace: SaveSpacePort,
  saveSpaceCardList: CreateSpaceCardListPort,
  saveCardList: CreateCardListPort,
  chatWithLLM: ChatLLMPort
) => SpaceCreateWithBookUseCase;

/**
 * @returns {Promise<string>} - Login token
 */
export type SpaceCreateWithBookUseCase = (props: {
  accountId: string;
  pagesMarkdown: string[];
  developerSetting?: {
    outlinePrompt?: string;
    splitCardPrompt?: string;
    useLLM?: LLMModel;
  };
}) => Promise<Space>;
