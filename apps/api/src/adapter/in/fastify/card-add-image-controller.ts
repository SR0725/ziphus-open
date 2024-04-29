import {
  OptionalAuthorizationHeaderSchema,
  CardAddImageRequestDTOSchema,
} from "@repo/shared-types";
import { z } from "zod";
import type { CardAddImageUseCase } from "@/application/port/in/card-add-image-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";

const cardAddImageController: FastifyControllerInterface<
  CardAddImageUseCase
> = (fastify, cardAddImageUseCase) => {
  fastify.route({
    method: "POST",
    url: "/card/:id/image",
    schema: {
      summary: "嘗試創建卡片圖片",
      tags: ["Card"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        id: z.string(),
      }),
      body: CardAddImageRequestDTOSchema,
      response: {
        200: z.boolean(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const cardId = request.params.id;
      const key = request.body.key;
      const url = request.body.url;
      const bytes = request.body.bytes;

      try {
        return await cardAddImageUseCase({
          accountId: accountToken?.accountId,
          cardId,
          data: {
            key,
            url,
            bytes,
          },
        });
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default cardAddImageController;
