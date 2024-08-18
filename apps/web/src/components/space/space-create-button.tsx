"use client";

import { useRef } from "react";
import React from "react";
import {
  GrDocumentPdf,
  GrDocument,
  GrDocumentNotes,
  GrDocumentTxt,
} from "react-icons/gr";
import { useRouter } from "next/navigation";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "../nextui";
import { toast } from "sonner";
import useCreateSpace from "@/hooks/space/useCreateSpace";
import { cn } from "@/utils/cn";

const defaultOutLinePrompt = `您是一名知識整合者，請採用首原則方法，對以下文本中的問題、情境資訊和補充資訊進行分解，找出其基本事實和構成要素。然後，分析這些要素，以重新構建和理解最有價值和相關的答案和輸出。在這個過程中，應運用思維樹狀結構方法，即在背景設定下創建多個詳細、有價值的答案和輸出版本，並從中選取最佳版本。在進行解釋性輸出時，除非特別指示需要簡潔，否則應提供全面的解釋。
最終，將這些資訊整合成一份詳盡的知識大綱，確保包含所有重要內容`;

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

export default function TextGenerateModal({
  isOpen,
  onClose,
  isGenerating,
  setIsGenerating,
}: {
  isOpen: boolean;
  onClose: () => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}) {
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const outlinePromptInputRef = useRef<HTMLTextAreaElement>(null);
  const cardSplitPromptInputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedModel, setSelectedModel] = React.useState("gpt-4"); // ["gpt-4", "gpt-3.5", "claude-haiku", "claude-sonnet"
  const mutateCreateSpace = useCreateSpace();
  const router = useRouter();
  const handleGenerate = async () => {
    onClose();
    const text = textInputRef.current?.value;
    if (!text) {
      return;
    }
    setIsGenerating(true);
    const waitingToast = toast.loading("正在解析文本...這會需要數秒的時間");
    const spaceData = await mutateCreateSpace.mutateAsync(
      {
        text: text,
        developerSetting: {
          outlinePrompt: outlinePromptInputRef.current?.value,
          splitCardPrompt: cardSplitPromptInputRef.current?.value,
          useLLM: selectedModel,
        },
      },
      {
        onError: (error) => {
          setIsGenerating(false);
          toast.error(
            `解析失敗...請回報管理員，原因：${JSON.stringify(error)}`
          );
        },
        onSuccess: (data) => {
          router.push(`/space/${data.data.space.id}`);
        },
      }
    );
    toast.dismiss(waitingToast);
  };

  return (
    <>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                從文本創建空間庫
              </ModalHeader>
              <ModalBody>
                <div className=" flex h-fit w-full justify-between gap-2 px-1 py-2">
                  <div className="flex w-full flex-col gap-2">
                    <Textarea
                      label="大綱生成 Prompt"
                      defaultValue={defaultOutLinePrompt}
                      ref={outlinePromptInputRef}
                    />
                    <Textarea
                      label="卡片切割 Prompt"
                      defaultValue={defaultCardFormatPrompt}
                      ref={cardSplitPromptInputRef}
                    />
                  </div>
                  <div className="flex h-96 w-full flex-col justify-between">
                    <Textarea
                      label="輸入文本"
                      ref={textInputRef}
                      size="lg"
                      rows={32}
                    />
                    <Select
                      label="使用模型"
                      className="max-w-xs"
                      value={selectedModel}
                      onChange={(e) => {
                        setSelectedModel(e.target.value);
                      }}
                    >
                      <SelectItem value="gpt-4" key="GPT4">
                        GPT4o
                      </SelectItem>
                      <SelectItem value="gpt-3.5" key="GPT3">
                        GPT3
                      </SelectItem>
                      <SelectItem value="claude-haiku" key="claude-haiku">
                        Claude Haiku
                      </SelectItem>
                      <SelectItem value="claude-sonnet" key="claude-sonnet">
                        Claude Sonnet
                      </SelectItem>
                    </Select>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleGenerate}>
                  創建
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

interface SpaceCreateButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
}
export function SpaceCreateButton({
  children,
  className,
  ...props
}: SpaceCreateButtonProps) {
  const mutateCreateSpace = useCreateSpace();
  const router = useRouter();

  return (
    <button
      className={cn(
        "w-fit rounded-full border border-solid border-black bg-black px-4 py-1 text-white transition-colors duration-300 hover:bg-white hover:text-black dark:border-white dark:hover:bg-black dark:hover:text-white",
        className
      )}
      onClick={async () => {
        const spaceData = await mutateCreateSpace.mutateAsync({});
        router.push(`/space/${spaceData.data.space.id}`);
      }}
      {...props}
    >
      {children || "Create"}
    </button>
  );
}
