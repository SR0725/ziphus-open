"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import useQuerySpaceById from "@/hooks/space/useQuerySpaceById";
import useUpdateSpaceTitle from "@/hooks/space/useUpdateSpaceTitle";
import { cn } from "@/utils/cn";

interface SpaceHeaderBarRetitleInputProps {
  inputClassName?: string;
  buttonClassName?: string;
}

function SpaceHeaderBarRetitleInput({
  inputClassName,
  buttonClassName,
}: SpaceHeaderBarRetitleInputProps) {
  const { id } = useParams();
  const { space } = useQuerySpaceById(id as string);
  const [showRetitleInput, setShowRetitleInput] = useState(false);
  const [newTitle, setNewTitle] = useState(space?.title || "");
  useEffect(() => {
    setNewTitle(space?.title || "");
  }, [space?.title]);
  const mutation = useUpdateSpaceTitle(id as string);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setShowRetitleInput(false);
    if (newTitle === space?.title) return;
    mutation.mutate(newTitle, {
      onSuccess: () => {
        setNewTitle(newTitle || "");
      },
    });
  };

  return (
    <>
      {showRetitleInput ? (
        <input
          ref={inputRef}
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
              setNewTitle(space?.title || "");
            } else if (e.key === "Escape") {
              setShowRetitleInput(false);
              setNewTitle(space?.title || "");
            }
          }}
          className={cn(
            "h-fit w-fit lg:w-full border-none bg-white dark:bg-[#0E0E0E] text-black dark:text-white",
            inputClassName
          )}
        />
      ) : (
        <button
          onDoubleClick={() => {
            setShowRetitleInput(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          onTouchStart={() => {
            setShowRetitleInput(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className={cn(
            "cursor-pointer text-black opacity-80 hover:opacity-100 dark:text-white",
            buttonClassName
          )}
        >
          {newTitle || "Untitled"}
        </button>
      )}
    </>
  );
}

export default SpaceHeaderBarRetitleInput;
