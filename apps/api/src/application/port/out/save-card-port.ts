import type Card from "@/application/domain/model/card";

export type SaveCardPort = (
  card: Partial<Card> & { id: string },
  needRealTime?: boolean
) => Promise<void>;
