import { type LoadCardPort } from "../out/load-card-port";
import { type SaveCardPort } from "../out/save-card-port";

export type CardModifyIsSizeFitContentUseCaseConstructor = (
  loadCard: LoadCardPort,
  saveCard: SaveCardPort
) => CardModifyIsSizeFitContentUseCase;

export type CardModifyIsSizeFitContentUseCase = (props: {
  accountId?: string;
  cardId: string;
  isSizeFitContent: boolean;
}) => Promise<boolean>;
