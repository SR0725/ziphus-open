import type { SpaceCard } from "@/application/domain/model/space";

interface DeleteResult {
  deletedSpaceCardIds: string[];
}

export type DeleteManySpaceCardPort = (
  where: Partial<SpaceCard>
) => Promise<DeleteResult>;
