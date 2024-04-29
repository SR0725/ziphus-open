import type Card from "@/application/domain/model/card";

export type SaveCardPort = (
  card: Card,
  needRealTime?: boolean
) => Promise<void>;
