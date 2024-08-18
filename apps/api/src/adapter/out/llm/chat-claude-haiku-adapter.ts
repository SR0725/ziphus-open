import type { LLMApiUsePort } from "@/application/port/out/llm-api-use-port";
import Anthropic from "@anthropic-ai/sdk";
import { Role } from "@/application/port/out/chat";
import fileToGenerativeBufferPart from "@/common/file-to-generative-buffer-part";

// need refactor
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const chatRoleToCompletionMap = {
  [Role.Bot]: "assistant",
  [Role.User]: "user",
};

const chatPricePerInputToken = 0.25 / 1000000;
const chatPricePerOutputToken = 1.25 / 1000000;

const ChatClaudeHaikuAdapter: LLMApiUsePort = async (prompt, chatHistories) => {
  const lastChat = chatHistories[chatHistories.length - 1];
  const chatHistoriesWithoutLastChat = chatHistories.slice(
    0,
    chatHistories.length - 1
  );
  const imageParts =
    lastChat!.imagePaths?.map(({ path, mimeType }) =>
      fileToGenerativeBufferPart(path, mimeType)
    ) ?? [];

  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 4096,
    system: prompt,
    messages: [
      ...(chatHistoriesWithoutLastChat.map((chat) => ({
        role: chatRoleToCompletionMap[chat.role],
        content: chat.content,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as Array<any>),
      {
        role: chatRoleToCompletionMap[lastChat!.role],
        content: [
          {
            type: "text",
            text: lastChat!.content,
          },
          ...(imageParts.map((imagePart) => ({
            type: "image",
            source: {
              type: "base64",
              media_type: imagePart.inlineData.mimeType,
              data: imagePart.inlineData.data,
            },
          })) ?? []),
        ],
      },
    ],
  });

  return {
    role: Role.Bot,
    content: response.content[0]?.text
      ? response.content[0]?.text
      : response.stop_reason || "Claude Opus chat failed",
    cost:
      response.usage.input_tokens * chatPricePerInputToken +
      response.usage.output_tokens * chatPricePerOutputToken,
  };
};

export default ChatClaudeHaikuAdapter;
