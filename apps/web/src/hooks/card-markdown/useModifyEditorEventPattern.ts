import { useEffect, useRef } from "react";
import { BlockNoteEditor, BlockSchemaFromSpecs } from "@blocknote/core";
import { schema } from "@/components/blocknote/block-note-setting";
import delay from "@/utils/delay";

/**
 * 修改編輯器默認事件模式，以符合特定需求
 * @param editor
 */
function useModifyEditorEventPattern(
  editor: BlockNoteEditor<BlockSchemaFromSpecs<typeof schema.blockSpecs>>
) {
  const plainCopyEventRef = useRef<ClipboardEvent | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      const pos = editor.getTextCursorPosition();
      if (pos.block.type === "codeblock") {
        event.preventDefault();
        event.stopPropagation();

        const keyEvent = new KeyboardEvent("keydown", {
          code: "Enter",
          key: "Enter",
          shiftKey: true,
          view: window,
          bubbles: false,
        });
        editor.domElement.dispatchEvent(keyEvent);
      }
    }
  };

  const handlePaste = (event: ClipboardEvent) => {
    const pasteCode = event.clipboardData?.getData("text/plain") ?? "";
    const pos = editor.getTextCursorPosition();
    if (
      pos.block.type === "codeblock" &&
      pasteCode !== "" &&
      plainCopyEventRef.current !== event
    ) {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "codeblock",
        content: pasteCode,
      });
      plainCopyEventRef.current = event;
      event.preventDefault();
      event.stopPropagation();
    }
  };

  useEffect(() => {
    async function handleAdjustEditorAction() {
      await delay(100);
      editor.domElement.addEventListener("keydown", handleKeyDown, true);
      editor.domElement.addEventListener("paste", handlePaste, true);
    }
    handleAdjustEditorAction();
  }, []);
}

export default useModifyEditorEventPattern;
