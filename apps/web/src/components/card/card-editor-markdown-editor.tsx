"use client";

import { useEffect, useRef, useState } from "react";
import { BlockNoteFormattingToolbarController, BlockNoteSuggestionMenu, schema } from "../blocknote/block-note-setting";
import { getCookie } from "cookies-next";
import * as Y from "yjs";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, darkDefaultTheme, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { SocketIOProvider } from "@repo/y-socket-io";
import useUpdateCardContent from "@/hooks/card/useUpdateCardContent";


const uploadFile = (cardId: string) => async (file: File) => {
  const body = new FormData();
  body.append("image", file);
  body.append("cardId", cardId);

  const response = await fetch("/api/object", {
    method: "POST",
    body,
    headers: {
      contentType: "multipart/form-data",
      authorization: getCookie("authorization") ?? "",
    },
  });

  const data = await response.json();

  return `${window.location.origin}/api/object/${data.key}`;
};

interface CardEditorMarkdownEditorProps {
  cardId: string;
  accountName: string;
  onContentSizeChange: (height: number) => void;
  provider: SocketIOProvider;
  doc: Y.Doc;
}
function CardEditorMarkdownEditor({
  cardId,
  accountName,
  onContentSizeChange,
  provider,
  doc,
}: CardEditorMarkdownEditorProps) {
  const tryUpdateCardContent = useUpdateCardContent(cardId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fragment] = useState(doc.getXmlFragment("card-content"));
  const [selectedBlocksType, setSelectedBlockType] = useState<string[]>([]);
  const plainCopyEventRef = useRef<ClipboardEvent | null>(null);

  const editor = useCreateBlockNote({
    schema,
    collaboration: {
      provider,
      fragment,
      user: {
        name: accountName,
        color: "#0066ff",
      },
    },
    uploadFile: uploadFile(cardId),
  });

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
      event.preventDefault();
      event.stopPropagation();
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "codeblock",
        content: pasteCode,
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      editor.domElement.addEventListener("keydown", handleKeyDown, true);
      editor.domElement.addEventListener("paste", handlePaste, true);
    }, 100);
  }, []);

  const onChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    tryUpdateCardContent(html);
    if (!containerRef.current) return;
    const offsetHeight = containerRef.current.offsetHeight;
    onContentSizeChange(offsetHeight);
  };

  return (
    <div className=" h-fit w-full text-white" ref={containerRef}>
      <BlockNoteView
        theme={darkDefaultTheme}
        editor={editor}
        onChange={onChange}
        slashMenu={false}
        onSelectionChange={() => {
          const selection = editor.getSelection();
          if (selection !== undefined) {
            setSelectedBlockType(selection.blocks.map((block) => block.type));
          } else {
            setSelectedBlockType([editor.getTextCursorPosition().block.type]);
          }
        }}
      >
        <BlockNoteFormattingToolbarController
          selectedBlocksType={selectedBlocksType}
        />
        <BlockNoteSuggestionMenu editor={editor} />
      </BlockNoteView>
    </div>
  );
}

export default CardEditorMarkdownEditor;