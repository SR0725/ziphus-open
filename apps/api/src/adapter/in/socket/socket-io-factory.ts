import type {
  Server as HttpServer,
  IncomingMessage,
  ServerResponse,
} from "node:http";
import type { FastifyBaseLogger, FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { Server } from "socket.io";

function SocketIoFactory(
  fastifyInstance: FastifyInstance<
    HttpServer,
    IncomingMessage,
    ServerResponse,
    FastifyBaseLogger,
    ZodTypeProvider
  >
): Server {
  const io = new Server(fastifyInstance.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  return io;
}

export default SocketIoFactory;
