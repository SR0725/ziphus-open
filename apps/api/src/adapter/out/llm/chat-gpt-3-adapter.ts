import type { LLMApiUsePort } from "@/application/port/out/llm-api-use-port";
import OpenAI from "openai";
import { Role } from "@/application/port/out/chat";

const openAi = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const chatRoleToCompletionMap = {
  [Role.Bot]: "assistant",
  [Role.User]: "user",
};

const chatPricePerInputToken = 0.5 / 1000000;
const chatPricePerOutputToken = 1.5 / 1000000;

const ChatGPT3Adapter: LLMApiUsePort = async (prompt, chatHistories) => {
  const completion = await openAi.chat.completions.create({
    max_tokens: 4096,
    messages: [
      { role: "system", content: prompt },
      ...(chatHistories.map((chat) => ({
        role: chatRoleToCompletionMap[chat.role],
        content: chat.content,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as Array<any>),
    ],
    model: "gpt-3.5-turbo",
  });

  const promptTokens = completion.usage?.prompt_tokens ?? 0;
  const completionTokens = completion.usage?.completion_tokens ?? 0;

  return {
    role: Role.Bot,
    content: completion.choices[0]?.message.content ?? "",
    cost:
      promptTokens * chatPricePerInputToken +
      completionTokens * chatPricePerOutputToken,
  };
};

export default ChatGPT3Adapter;
