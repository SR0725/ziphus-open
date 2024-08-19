import type Card from "@/application/domain/model/card";

export type CreateCardListPort = (cards: Card[]) => Promise<void>;
