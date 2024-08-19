import type { ChatLLMPort } from "@/application/port/out/chat-llm-port";
import ChatGPT3Adapter from "./chat-gpt-3-adapter";
import ChatGPT4Adapter from "./chat-gpt-4-adapter";
import ChatGeminiProAdapter from "./chat-gemini-pro-adapter";
import { LLMModel } from "@/application/port/in/llm-model";
import { Role, type Chat } from "@/application/port/out/chat";
import ChatClaudeSonnetAdapter from "./chat-claude-sonnet-adapter";
import ChatClaudeOpusAdapter from "./chat-claude-opus-adapter";
import ChatClaudeHaikuAdapter from "./chat-claude-haiku-adapter";

const ChatAdapter: ChatLLMPort = async (
  useModel: string,
  prompt,
  chatHistories
) => {
  try {
    if (useModel === LLMModel.GPT3) {
      return ChatGPT3Adapter(prompt, chatHistories);
    } else if (useModel === LLMModel.GPT4) {
      return ChatGPT4Adapter(prompt, chatHistories);
    } else if (useModel === LLMModel.GEMINI_PRO) {
      return ChatGeminiProAdapter(prompt, chatHistories);
    } else if (useModel === LLMModel.CLAUDE_SONNET) {
      return ChatClaudeSonnetAdapter(prompt, chatHistories);
    } else if (useModel === LLMModel.CLAUDE_OPUS) {
      return ChatClaudeOpusAdapter(prompt, chatHistories);
    } else if (useModel === LLMModel.CLAUDE_HAIKU) {
      return ChatClaudeHaikuAdapter(prompt, chatHistories);
    }

    throw new Error("Model not supported");
  } catch (error) {
    const errorChat: Chat = {
      role: Role.Bot,
      content: `發生錯誤：${JSON.stringify(error)}`,
      cost: 0,
      imagePaths: [],
    };
    return errorChat;
  }
};

export default ChatAdapter;
