import { YSocketIO } from "@repo/y-socket-io/dist/server";
import { type LoadCardPort } from "../out/load-card-port";
import { type SaveCardPort } from "../out/save-card-port";

export type CardUpdateSnapshotContentUseCaseConstructor = (
  loadCard: LoadCardPort,
  saveCard: SaveCardPort,
  ySocketIo: YSocketIO
) => void;
