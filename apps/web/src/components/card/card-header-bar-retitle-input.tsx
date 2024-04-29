"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import useQueryCardById from "@/hooks/card/useQueryCardById";
import useUpdateCardTitle from "@/hooks/card/useUpdateCardTitle";

function CardHeaderBarRetitleInput() {
  const { id } = useParams();
  const { card } = useQueryCardById(id as string);
  const [showRetitleInput, setShowRetitleInput] = useState(false);
  const [newTitle, setNewTitle] = useState(card?.title || "");
  const mutation = useUpdateCardTitle(id as string);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setShowRetitleInput(false);
    if (newTitle === card?.title) return;
    mutation.mutate(newTitle);
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
              setNewTitle(card?.title || "");
            } else if (e.key === "Escape") {
              setShowRetitleInput(false);
              setNewTitle(card?.title || "");
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
          {card?.title || "Untitled"}
        </button>
      )}
    </>
  );
}

export default CardHeaderBarRetitleInput;
