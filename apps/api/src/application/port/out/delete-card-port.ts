import type Card from "@/application/domain/model/card";

export type DeleteCardPort = (card: Card) => Promise<void>;
