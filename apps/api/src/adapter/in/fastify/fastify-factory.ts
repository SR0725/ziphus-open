import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import multipart from "@fastify/multipart";

function fastifyFactory(port = 8080) {
  const fastify = Fastify();
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  fastify.register(cors, {
    origin: ["*"],
    credentials: true,
  });
  fastify.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 10,
      fileSize: 50000000,
      files: 1,
      headerPairs: 2000,
    },
  });
  fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Ziphus API",
        description: "Ziphus API Documentation",
        version: "1.0.0",
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  });
  fastify.register(fastifySwaggerUI, {
    routePrefix: "/documentation",
  });         

  return fastify.withTypeProvider<ZodTypeProvider>();
}

export default fastifyFactory;
