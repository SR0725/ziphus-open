import { LLMModel } from "@/application/port/in/llm-model";
import { Chat, Role } from "@/application/port/out/chat";
import { ChatLLMPort } from "@/application/port/out/chat-llm-port";
import { LLMData } from "../model/card";
import { randomUUID } from "crypto";

const defaultOutLinePrompt = `您是一名知識整合者，請採用首原則方法，對以下文本中的問題、情境資訊和補充資訊進行分解，找出其基本事實和構成要素。然後，分析這些要素，以重新構建和理解最有價值和相關的答案和輸出。在這個過程中，應運用思維樹狀結構方法，即在背景設定下創建多個詳細、有價值的答案和輸出版本，並從中選取最佳版本。在進行解釋性輸出時，除非特別指示需要簡潔，否則應提供全面的解釋。
最終，將這些資訊整合成一份詳盡的知識大綱，確保包含所有重要內容`;

const defaultUseModel = LLMModel.GPT4;

export default async function generateCardOutline(
  chatWithLLM: ChatLLMPort,
  text: string,
  usePrompt: string = defaultOutLinePrompt,
  useModel: LLMModel = defaultUseModel
): Promise<[Chat, LLMData]> {
  const generateStartTime = new Date().getTime();
  const outlineChat: Chat[] = [
    {
      role: Role.User,
      content: text,
      cost: 0,
    },
  ];
  const outlineResponse = await chatWithLLM(useModel, usePrompt, outlineChat);
  const generateEndTime = new Date().getTime();

  return [
    outlineResponse,
    new LLMData(
      randomUUID(),
      "生成大綱",
      usePrompt,
      text,
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
