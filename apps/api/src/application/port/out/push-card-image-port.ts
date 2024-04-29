import type Card from "@/application/domain/model/card";
import { type Image } from "@/application/domain/model/card";

export type PushCardImagePort = (card: Card, image: Image) => Promise<void>;
