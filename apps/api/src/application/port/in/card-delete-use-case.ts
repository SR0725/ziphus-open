import { type LoadCardPort } from "../out/load-card-port";
import { type DeleteCardPort } from "../out/delete-card-port";
import type { DeleteManySpaceCardPort } from "../out/delete-many-space-card-port";

interface DeleteResult {
  cardId: string;
  spaceCardIds: string[];
}

export type CardDeleteUseCaseConstructor = (
  loadCard: LoadCardPort,
  deleteCard: DeleteCardPort,
  deleteManySpaceCard: DeleteManySpaceCardPort
) => CardDeleteUseCase;

export type CardDeleteUseCase = (props: {
  accountId: string;
  cardId: string;
}) => Promise<DeleteResult>;
