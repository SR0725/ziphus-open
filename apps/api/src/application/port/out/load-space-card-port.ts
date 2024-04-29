import type { SpaceCard } from "@/application/domain/model/space";

export type LoadSpaceCardPort = (where: Partial<SpaceCard>) => Promise<SpaceCard | null>;
