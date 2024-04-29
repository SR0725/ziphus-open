import { type LoadCardPort } from "../out/load-card-port";
import { type SaveCardPort } from "../out/save-card-port";

export type CardModifyPermissionUseCaseConstructor = (
  loadCard: LoadCardPort,
  saveCard: SaveCardPort
) => CardModifyPermissionUseCase;

export type CardModifyPermissionUseCase = (props: {
  accountId: string;
  cardId: string;
  permission: string;
}) => Promise<boolean>;
