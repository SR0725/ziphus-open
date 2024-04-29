import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  jsonSchemaTransform,
  createJsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

function fastifyFactory(port = 8080) {
  const fastify = Fastify();
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  fastify.register(cors, {
    origin: ["*"],
    credentials: true,
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

  fastify
    .listen({
      port,
      host: "0.0.0.0",
    })
    .then((address) => {
      console.log(`Server listening on ${address}`);
    });

  return fastify.withTypeProvider<ZodTypeProvider>();
}

export default fastifyFactory;
