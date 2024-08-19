import type { Chat } from "./chat";

export interface LLMApiUsePort {
  (prompt:string, chatHistories: Chat[]): Promise<Chat>;
}