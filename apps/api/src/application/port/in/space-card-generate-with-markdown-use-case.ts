import { LoadSpacePort } from "../out/load-space-port";
import { SpaceCard } from "@/application/domain/model/space";
import { CreateSpaceCardListPort } from "../out/create-space-card-list-port";
import { CreateCardListPort } from "../out/create-card-list-port";

export type SpaceCardGenerateWithMarkdownUseCaseConstructor = (
  loadSpace: LoadSpacePort,
  saveSpaceCardList: CreateSpaceCardListPort,
  saveCardList: CreateCardListPort
) => SpaceCardGenerateWithMarkdownUseCase;

export type SpaceCardGenerateWithMarkdownUseCase = (props: {
  accountId?: string;
  spaceId?: string;
  markdown: string[];
}) => Promise<SpaceCard[]>;
