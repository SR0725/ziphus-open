import type {
  SpaceCardListGetBySpaceIdResponseDTO} from "@repo/shared-types";
import {
  OptionalAuthorizationHeaderSchema,
  SpaceCardListGetBySpaceIdResponseDTOSchema
} from "@repo/shared-types";
import z from "zod";
import type { SpaceCardListGetBySpaceIdUseCase } from "@/application/port/in/space-card-list-get-by-space-id-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";

const spaceCardListGetBySpaceIdController: FastifyControllerInterface<
  SpaceCardListGetBySpaceIdUseCase
> = (fastify, spaceCardListGetBySpaceIdUseCase) => {
  fastify.route({
    method: "GET",
    url: "/space/:spaceId/space-card/list",
    schema: {
      summary: "嘗試取得指定空間的所有卡片",
      tags: ["SpaceCard"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        spaceId: z.string(),
      }),
      querystring: z.object({
        combineTargetCard: z.string().optional(),
      }),
      response: {
        200: SpaceCardListGetBySpaceIdResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const targetSpaceId = request.params.spaceId;
      const isCombineTargetCard = request.query.combineTargetCard === "true";

      try {
        const SpaceCardListCombineTargetCard =
          await spaceCardListGetBySpaceIdUseCase({
            accountId: accountToken?.accountId,
            spaceId: targetSpaceId,
            isCombineTargetCard,
          });

        return {
          spaceCards: SpaceCardListCombineTargetCard,
        } as SpaceCardListGetBySpaceIdResponseDTO;
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default spaceCardListGetBySpaceIdController;
