import type { Server, IncomingMessage, ServerResponse } from "node:http";
import type { FastifyBaseLogger, FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

type FastifyControllerInterface<T> = (
    fastify: FastifyInstance<
      Server,
      IncomingMessage,
      ServerResponse,
      FastifyBaseLogger,
      ZodTypeProvider
    >,
    ...useCases: T[]
  ) => void;

export default FastifyControllerInterface;
