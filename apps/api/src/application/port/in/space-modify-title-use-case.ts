import { type LoadSpacePort } from "../out/load-space-port";
import { type SaveSpacePort } from "../out/save-space-port";

export type SpaceModifyTitleUseCaseConstructor = (
  loadSpace: LoadSpacePort,
  saveSpace: SaveSpacePort
) => SpaceModifyTitleUseCase;

export type SpaceModifyTitleUseCase = (props: {
  accountId?: string;
  spaceId: string;
  title: string;
}) => Promise<boolean>;
