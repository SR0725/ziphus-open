import type { Socket } from "socket.io";

type IoControllerInterface<T> = (socket: Socket, ...useCases: T[]) => void;

export default IoControllerInterface;
