import { LLMModel } from "@/application/port/in/llm-model";
import { Chat, Role } from "@/application/port/out/chat";
import { ChatLLMPort } from "@/application/port/out/chat-llm-port";
import { LLMData } from "../model/card";
import { randomUUID } from "crypto";

const defaultCardFormatPrompt = `
你是一個知識統整助理,專門協助人類將長篇文章內容摘錄成重點大綱卡片。你的任務包括:
我將給你一個一篇文章的重點大綱，以及該文章本身

1. 根據大綱，將閱讀的過程中看到的所有與該大綱有關的重要段落記錄成卡片
2. 以原文中的段落為單位,製作成獨立的知識卡片
3. 不要自行添加內容、生成重點
6. 節錄卡片時,僅需節錄開頭幾個文字(10字左右)即可,以節省成本。 
7. 請以繁體中文呈現所有回應和輸出內容,遵循臺灣的國語方言和用語習慣。 
8. 維持清晰直接的語氣,如同母語者的自然對話方式。 
9. 返回文字不需要換行,直接接在上一句後面即可。

使用以下XML格式製作每張卡片:

<card>
<title>{撰寫對該卡片的標題}</title>
<start>{卡片開頭幾個字}</start>
<end>{卡片結尾幾個字}</end>
</card>
`;
const defaultUseModel = LLMModel.GPT4;

export default async function generateCardFormat(
  chatWithLLM: ChatLLMPort,
  text: string,
  outlineResponse: Chat,
  usePrompt: string = defaultCardFormatPrompt,
  useModel: LLMModel = defaultUseModel
): Promise<[Chat, LLMData]> {
  const content = `文章大綱:${outlineResponse.content} \n\n文章:${text}`;
  const generateStartTime = new Date().getTime();
  const cardFormatChat: Chat[] = [
    {
      role: Role.User,
      content: content,
      cost: 0,
    },
  ];
  const response = await chatWithLLM(useModel, usePrompt, cardFormatChat);
  const generateEndTime = new Date().getTime();

  return [
    response,
    new LLMData(
      randomUUID(),
      "生成大綱",
      usePrompt,
      content,
      useModel,
      outlineResponse.content,
      outlineResponse.cost,
      generateEndTime - generateStartTime,
      new Date().toISOString(),
      new Date().toISOString(),
      null
    ),
  ];
}
