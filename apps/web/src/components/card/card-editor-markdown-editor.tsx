"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BlockNoteFormattingToolbarController,
  BlockNoteSuggestionMenu,
  schema,
} from "../blocknote/block-note-setting";
import { getCookie } from "cookies-next";
import * as Y from "yjs";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  darkDefaultTheme,
  lightDefaultTheme,
  Theme,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { SocketIOProvider } from "@repo/y-socket-io";
import useModifyEditorEventPattern from "@/hooks/card-markdown/useModifyEditorEventPattern";
import useChangeCardContentCase from "@/hooks/card/useChangeCardContentCase";
import useUpdateCardTitleCase from "@/hooks/card/useUpdateCardTitleCase";
import useCardsStore from "@/stores/useCardsStore";
import useThemeStore from "@/stores/useThemeStore";
import "@/styles/markdown-editor.css";

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
  editable: boolean;
}
function CardEditorMarkdownEditor({
  cardId,
  accountName,
  onContentSizeChange,
  provider,
  doc,
  editable,
}: CardEditorMarkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fragment] = useState(doc.getXmlFragment("card-content"));
  const [selectedBlocksType, setSelectedBlockType] = useState<string[]>([]);
  const theme = useThemeStore((state) => state.theme);

  const editor = useCreateBlockNote({
    schema,
    domAttributes: {
      editor: {
        class: "block-editor",
      },
    },
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

  useModifyEditorEventPattern(editor as any);
  useChangeCardContentCase(cardId, editor as any);
  const [isWritingTitle, setIsWritingTitle] = useState(false);

  const { getIsWritingTitle, handleUpdateCardTitleCase } =
    useUpdateCardTitleCase(cardId, editor as any);

  const onChange = async () => {
    if (!containerRef.current) return;
    const offsetHeight = containerRef.current.offsetHeight;
    onContentSizeChange(offsetHeight);
    if (getIsWritingTitle()) {
      setIsWritingTitle(true);
    } else {
      setIsWritingTitle(false);
    }
  };

  useEffect(() => {
    return () => {
      const setCard = useCardsStore.getState().setCard;
      editor.blocksToHTMLLossy().then(async (html) => {
        setCard({
          id: cardId,
          snapshotContent: html,
        });
      });
    };
  }, []);
  const defaultTheme = useMemo(
    () => (theme === "light" ? lightDefaultTheme : darkDefaultTheme),
    [theme]
  );

  const blockNoteTheme: Theme = useMemo(
    () => ({
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        editor: {
          ...defaultTheme.colors.editor,
          background: "transparent",
        },
      },
    }),
    [defaultTheme]
  );

  return (
    <div
      className={`markdown-render relative h-fit w-full ${
        editable ? "editable" : "not-editable"
      }`}
      ref={containerRef}
    >
      {editable && isWritingTitle && (
        <div className=" absolute right-0 top-0 z-20">
          <button
            onClick={() => {
              handleUpdateCardTitleCase();
              setIsWritingTitle(false);
            }}
            className="  rounded-lg bg-gray-500 px-2 py-1 text-sm text-white"
          >
            將目前的標題套用為卡片標題
          </button>
        </div>
      )}
      <BlockNoteView
        theme={blockNoteTheme}
        editor={editor}
        onChange={onChange}
        slashMenu={false}
        editable={editable}
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
