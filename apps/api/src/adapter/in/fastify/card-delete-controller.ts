import { AuthorizationHeaderSchema } from "@repo/shared-types";
import { z } from "zod";
import type { CardDeleteUseCase } from "@/application/port/in/card-delete-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type { EmitSocketPort } from "@/application/port/out/emit-socket-port";
import type FastifyControllerInterface from "./fastify-controller-interface";

const cardDeleteController: FastifyControllerInterface<
  [CardDeleteUseCase, EmitSocketPort]
> = (fastify, [cardDeleteUseCase, emitSocket]) => {
  fastify.route({
    method: "DELETE",
    url: "/card/:id",
    schema: {
      summary: "刪除卡片",
      tags: ["Card"],
      headers: AuthorizationHeaderSchema,
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.boolean(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }
      const cardId = request.params.id;

      try {
        const deleteResult = await cardDeleteUseCase({
          accountId: accountToken.accountId,
          cardId,
        });
        if (deleteResult.spaceCardIds.length > 0) {
          // TODO: 這種寫法會造成大量無用通知被廣播多次，未來改善
          deleteResult.spaceCardIds.forEach((spaceCardId) => {
            emitSocket({
              event: "space:card:delete",
              data: {
                spaceCardId,
              },
            });
          });
        }
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default cardDeleteController;
