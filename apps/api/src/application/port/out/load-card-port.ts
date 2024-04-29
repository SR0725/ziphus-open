import type Card from "@/application/domain/model/card";

export type LoadCardPort = (where: Partial<Card>) => Promise<Card | null>;
