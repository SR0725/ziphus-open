import {
  OptionalAuthorizationHeaderSchema,
  LinkSpaceCardConnectRequestDTOSchema,
  SpaceCardDTOSchema,
} from "@repo/shared-types";
import z from "zod";
import type { LinkSpaceCardConnectUseCase } from "@/application/port/in/link-space-card-connect-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type { EmitSocketPort } from "@/application/port/out/emit-socket-port";
import type FastifyControllerInterface from "./fastify-controller-interface";
import { LinkDirection } from "@/application/domain/model/space";

const linkSpaceCardConnectController: FastifyControllerInterface<
  [LinkSpaceCardConnectUseCase, EmitSocketPort]
> = (fastify, [linkSpaceCardConnectUseCase, emitSocket]) => {
  fastify.route({
    method: "POST",
    url: "/space/:spaceId/space-card/link",
    schema: {
      summary: "嘗試建立空間卡片與空間卡片的連結",
      tags: ["SpaceCard"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        spaceId: z.string(),
      }),
      body: LinkSpaceCardConnectRequestDTOSchema,
      response: {
        200: SpaceCardDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const targetSpaceId = request.params.spaceId;
      const {
        startSpaceCardId,
        endSpaceCardId,
        startSpaceCardDirection,
        endSpaceCardDirection,
      } = request.body;

      try {
        const spaceCard = await linkSpaceCardConnectUseCase({
          accountId: accountToken?.accountId,
          spaceId: targetSpaceId,
          startSpaceCardId,
          endSpaceCardId,
          startSpaceCardDirection: startSpaceCardDirection as LinkDirection,
          endSpaceCardDirection: endSpaceCardDirection as LinkDirection,
        });
        emitSocket({
          event: "space:card:link:connect",
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

export default linkSpaceCardConnectController;
