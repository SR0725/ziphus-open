import {
  OptionalAuthorizationHeaderSchema,
  LinkSpaceCardRemoveDTOSchema,
  SpaceCardDTOSchema,
} from "@repo/shared-types";
import z from "zod";
import type { LinkSpaceCardRemoveUseCase } from "@/application/port/in/link-space-card-remove-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type { EmitSocketPort } from "@/application/port/out/emit-socket-port";
import type FastifyControllerInterface from "./fastify-controller-interface";

const linkSpaceCardRemoveController: FastifyControllerInterface<
  [LinkSpaceCardRemoveUseCase, EmitSocketPort]
> = (fastify, [linkSpaceCardRemoveUseCase, emitSocket]) => {
  fastify.route({
    method: "DELETE",
    url: "/space/:spaceId/space-card/link",
    schema: {
      summary: "嘗試建立空間卡片與空間卡片的連結",
      tags: ["SpaceCard"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        spaceId: z.string(),
      }),
      body: LinkSpaceCardRemoveDTOSchema,
      response: {
        200: SpaceCardDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const targetSpaceId = request.params.spaceId;
      const { targetSpaceCardId, linkLineId } = request.body;
      try {
        const spaceCard = await linkSpaceCardRemoveUseCase({
          accountId: accountToken?.accountId,
          spaceId: targetSpaceId,
          targetSpaceCardId,
          linkLineId,
        });
        emitSocket({
          event: "space:card:link:remove",
          data: spaceCard,
          room: targetSpaceId,
        });
        return spaceCard;
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default linkSpaceCardRemoveController;
