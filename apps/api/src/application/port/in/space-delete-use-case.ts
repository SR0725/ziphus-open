import { type LoadSpacePort } from "../out/load-space-port";
import { type DeleteSpacePort } from "../out/delete-space-port";

export type SpaceDeleteUseCaseConstructor = (
    loadSpace: LoadSpacePort,
    deleteSpace: DeleteSpacePort
) => SpaceDeleteUseCase;

export type SpaceDeleteUseCase = (props: {
    accountId: string;
    spaceId: string;
}) => Promise<boolean>;
