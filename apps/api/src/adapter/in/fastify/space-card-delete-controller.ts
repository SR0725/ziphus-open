import { OptionalAuthorizationHeaderSchema } from "@repo/shared-types";
import z from "zod";
import type { SpaceCardDeleteUseCase } from "@/application/port/in/space-card-delete-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type { EmitSocketPort } from "@/application/port/out/emit-socket-port";
import type FastifyControllerInterface from "./fastify-controller-interface";

const spaceCardDeleteController: FastifyControllerInterface<
  [SpaceCardDeleteUseCase, EmitSocketPort]
> = (fastify, [spaceCardDeleteUseCase, emitSocket]) => {
  fastify.route({
    method: "DELETE",
    url: "/space/:spaceId/space-card/:spaceCardId",
    schema: {
      summary: "嘗試刪除指定空間的空間卡片",
      tags: ["SpaceCard"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        spaceCardId: z.string(),
        spaceId: z.string(),
      }),
      response: {
        200: z.boolean(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const spaceCardId = request.params.spaceCardId;
      const spaceId = request.params.spaceId;
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }

      try {
        await spaceCardDeleteUseCase({
          accountId: accountToken.accountId,
          spaceCardId,
        });

        emitSocket({
          event: "space:card:delete",
          data: {
            spaceCardId,
          },
          room: spaceId,
        });
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default spaceCardDeleteController;
