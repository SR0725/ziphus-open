import type { LLMApiUsePort } from "@/application/port/out/llm-api-use-port";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { Role } from "@/application/port/out/chat";
import fileToGenerativeBufferPart from "@/common/file-to-generative-buffer-part";

// need refactor
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const chatRoleToCompletionMap = {
  [Role.Bot]: "model",
  [Role.User]: "user",
};

const chatPricePerInputToken = 0;
const chatPricePerOutputToken = 0;

const ChatGeminiProAdapter: LLMApiUsePort = async (prompt, chatHistories) => {
  const lastChat = chatHistories[chatHistories.length - 1];
  const usedModel =
    lastChat?.imagePaths && lastChat.imagePaths.length >= 1
      ? "gemini-pro-vision"
      : "gemini-pro";

  const model = genAI.getGenerativeModel({
    model: usedModel,
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 4096,
      topP: 0,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  const imageParts = lastChat?.imagePaths?.map(({ path, mimeType }) =>
    fileToGenerativeBufferPart(path, mimeType)
  );

  const chatParts = [
    ...(chatHistories.map((chat) => ({
      role: chatRoleToCompletionMap[chat.role],
      parts: chat.content,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as Array<any>),
  ];

  const sendPrompt =
    prompt +
    chatParts
      .map((chatPart) => {
        return `<卡片內容>${chatPart.role}: ${chatPart.parts}</卡片內容>\n`;
      })
      .join("");

  const result = await model.generateContent(
    usedModel === "gemini-pro-vision"
      ? [sendPrompt, ...imageParts!]
      : sendPrompt
  );
  const response = await result.response;
  const content = response.text();

  const { totalTokens: promptTokens } = await model.countTokens(
    lastChat?.content ?? ""
  );
  const { totalTokens: completionTokens } = await model.countTokens(content);

  return {
    role: Role.Bot,
    content: content || "Gemini Pro chat failed",
    cost:
      promptTokens * chatPricePerInputToken +
      completionTokens * chatPricePerOutputToken,
  };
};

export default ChatGeminiProAdapter;
