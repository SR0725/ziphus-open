import { type Chat } from "./chat";

export interface ChatLLMPort {
  (useModel: string, prompt:string, chatHistories: Chat[]): Promise<Chat>;
}
