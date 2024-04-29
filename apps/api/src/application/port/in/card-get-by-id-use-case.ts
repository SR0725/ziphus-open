import type Card from "@/application/domain/model/card";
import { type LoadCardPort } from "../out/load-card-port";

export type CardGetByIdUseCaseConstructor = (loadCard: LoadCardPort) => CardGetByIdUseCase;

export type CardGetByIdUseCase = (props: { cardId: string; accountId?: string }) => Promise<Card | null>;
