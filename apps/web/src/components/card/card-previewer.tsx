"use client";

import { useEffect, useState } from "react";
import useGetCard from "../../hooks/card/useGetCard";
import { CardGetByIdResponseDTO } from "@repo/shared-types";
import useCardsStore from "@/stores/useCardsStore";

export function CardPreviewer({
  initialCard,
  cardId,
}: {
  cardId: string;
  initialCard: CardGetByIdResponseDTO["card"];
}) {
  const getCard = useGetCard();
  const [card, setCard] = useState(initialCard);
  useEffect(() => {
    useCardsStore.subscribe(() => {
      const targetCard = getCard(cardId);
      if (!targetCard) return;
      setCard(targetCard);
    });
  }, []);

  return (
    <div
      className="markdown-render"
      dangerouslySetInnerHTML={{
        __html: card?.snapshotContent ?? "",
      }}
    ></div>
  );
}
