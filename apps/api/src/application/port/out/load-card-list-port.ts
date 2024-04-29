import type Card from "@/application/domain/model/card";

export type LoadCardListPort = (where: Partial<Card>) => Promise<Card[] | null>;
