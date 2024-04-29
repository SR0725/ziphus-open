import type Space from "@/application/domain/model/space";
import { type LoadSpacePort } from "../out/load-space-port";

export type SpaceGetByIdUseCaseConstructor = (loadSpace: LoadSpacePort) => SpaceGetByIdUseCase;

export type SpaceGetByIdUseCase = (props: { spaceId: string; accountId?: string }) => Promise<Space | null>;
