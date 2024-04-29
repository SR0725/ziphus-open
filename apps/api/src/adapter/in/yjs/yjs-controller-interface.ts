import type { YSocketIO } from "@repo/y-socket-io/dist/server";

type YJSControllerInterface<T> = (
  ySocketIO: YSocketIO,
  ...useCases: T[]
) => void;

export default YJSControllerInterface;
