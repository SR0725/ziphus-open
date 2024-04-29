import type Card from "@/application/domain/model/card";
import { type LoadCardListPort } from "../out/load-card-list-port";

export type CardGetWithAllUseCaseConstructor = (loadCardList: LoadCardListPort) => CardGetWithAllUseCase;

export type CardGetWithAllUseCase = (props: { accountId: string }) => Promise<Card[]>;
