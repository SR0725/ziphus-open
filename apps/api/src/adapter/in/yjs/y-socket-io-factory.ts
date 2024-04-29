import type { Server } from "socket.io";
import { YSocketIO } from "@repo/y-socket-io/dist/server";

async function YSocketIOFactory(io: Server) {
  const ySocketIo = new YSocketIO(io);
  ySocketIo.initialize();
  return ySocketIo;
}

export default YSocketIOFactory;
