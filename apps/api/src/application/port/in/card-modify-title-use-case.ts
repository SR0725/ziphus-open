import { type LoadCardPort } from "../out/load-card-port";
import { type SaveCardPort } from "../out/save-card-port";

export type CardModifyTitleUseCaseConstructor = (
  loadCard: LoadCardPort,
  saveCard: SaveCardPort
) => CardModifyTitleUseCase;

export type CardModifyTitleUseCase = (props: {
  accountId?: string;
  cardId: string;
  title: string;
}) => Promise<boolean>;
