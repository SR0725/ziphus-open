import {
  AuthorizationHeaderSchema,
  CardCreateResponseDTOSchema,
  CardPermissionDTO,
} from "@repo/shared-types";
import type { CardCreateUseCase } from "@/application/port/in/card-create-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";

const cardCreateController: FastifyControllerInterface<CardCreateUseCase> = (
  fastify,
  cardCreateUseCase
) => {
  fastify.route({
    method: "POST",
    url: "/card",
    schema: {
      summary: "建立新卡片",
      tags: ["Card"],
      headers: AuthorizationHeaderSchema,
      response: {
        200: CardCreateResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }

      try {
        const card = await cardCreateUseCase({
          accountId: accountToken.accountId,
        });
        const cardDto = {
          ...card,
          permission: CardPermissionDTO[card.permission],
        };

        return {
          card: cardDto,
        };
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default cardCreateController;
