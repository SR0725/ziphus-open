"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import useQuerySpaceById from "@/hooks/space/useQuerySpaceById";
import useUpdateSpaceTitle from "@/hooks/space/useUpdateSpaceTitle";

function SpaceHeaderBarRetitleInput() {
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
          className="h-fit w-full border-none bg-[#0E0E0E] text-white"
        />
      ) : (
        <button
          onDoubleClick={() => {
            setShowRetitleInput(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className="cursor-pointer text-white opacity-80 hover:opacity-100"
        >
          {newTitle || "Untitled"}
        </button>
      )}
    </>
  );
}

export default SpaceHeaderBarRetitleInput;
