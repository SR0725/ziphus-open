import { type LoadCardPort } from "../out/load-card-port";

export type CardAccessEditValidatorUseCaseConstructor = (
  loadCard: LoadCardPort
) => CardAccessEditValidatorUseCase;

export type CardAccessEditValidatorUseCase = (props: {
  accountId?: string;
  cardId: string;
}) => Promise<{
  available: boolean;
}>;
