import { type LoadCardPort } from "../out/load-card-port";
import { type SaveCardPort } from "../out/save-card-port";

export type CardModifySizeUseCaseConstructor = (
  loadCard: LoadCardPort,
  saveCard: SaveCardPort
) => CardModifySizeUseCase;

export type CardModifySizeUseCase = (props: {
  accountId?: string;
  cardId: string;
  width?: number;
  height?: number;
}) => Promise<boolean>;
