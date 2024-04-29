import { type LoadCardPort } from "../out/load-card-port";
import { type PushCardImagePort } from "../out/push-card-image-port";

export type CardAddImageUseCaseConstructor = (
  loadCard: LoadCardPort,
  pushCardImage: PushCardImagePort
) => CardAddImageUseCase;

export type CardAddImageUseCase = (props: {
  accountId?: string;
  cardId: string;
  data: {
    url: string;
    key: string;
    bytes: number;
  };
}) => Promise<boolean>;
