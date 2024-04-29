import {
  OptionalAuthorizationHeaderSchema,
  SpaceCardUpdateLayerRequestDTOSchema,
  SpaceCardUpdateLayerResponseDTOSchema,
} from "@repo/shared-types";
import z from "zod";
import type { SpaceCardUpdateLayerUseCase } from "@/application/port/in/space-card-update-layer-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type { EmitSocketPort } from "@/application/port/out/emit-socket-port";
import type FastifyControllerInterface from "./fastify-controller-interface";

const spaceCardUpdateLayerController: FastifyControllerInterface<
  [SpaceCardUpdateLayerUseCase, EmitSocketPort]
> = (fastify, [spaceCardUpdateLayerUseCase, emitSocket]) => {
  fastify.route({
    method: "PUT",
    url: "/space/:spaceId/space-card/:spaceCardId/layer",
    schema: {
      summary: "嘗試替指定空間卡片更新圖層",
      tags: ["SpaceCard"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        spaceCardId: z.string(),
        spaceId: z.string(),
      }),
      body: SpaceCardUpdateLayerRequestDTOSchema,
      response: {
        200: SpaceCardUpdateLayerResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const spaceId = request.params.spaceId;
      const spaceCardId = request.params.spaceCardId;
      const { operation } = request.body;
      try {
        const spaceCardIdList = await spaceCardUpdateLayerUseCase({
          accountId: accountToken?.accountId,
          targetSpaceCardId: spaceCardId,
          operation,
        });
        emitSocket({
          event: "space:card:update-layer",
          data: spaceCardIdList,
          room: spaceId,
        });
        return spaceCardIdList;
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default spaceCardUpdateLayerController;
