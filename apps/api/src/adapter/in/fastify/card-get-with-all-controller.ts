import {
  AuthorizationHeaderSchema,
  CardGetWithAllResponseDTO,
  CardGetWithAllResponseDTOSchema,
  CardPermissionDTO,
} from "@repo/shared-types";
import type { CardGetWithAllUseCase } from "@/application/port/in/card-get-with-all-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";

const cardGetWithAllController: FastifyControllerInterface<
  CardGetWithAllUseCase
> = (fastify, cardGetWithAllUseCase) => {
  fastify.route({
    method: "GET",
    url: "/cards",
    schema: {
      summary: "取得該帳號所有卡片",
      tags: ["Card"],
      headers: AuthorizationHeaderSchema,
      response: {
        200: CardGetWithAllResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }

      try {
        const cards =
          (await cardGetWithAllUseCase({
            accountId: accountToken.accountId,
          })) ?? [];
        const cardsDto = cards.map((card) => {
          return {
            ...card,
            permission: CardPermissionDTO[card.permission],
          };
        });
        return {
          cards: cardsDto,
        };
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default cardGetWithAllController;
