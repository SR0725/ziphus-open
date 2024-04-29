import type { SpaceDto } from "@repo/shared-types";
import {
  OptionalAuthorizationHeaderSchema,
  SpaceGetByIdResponseDTOSchema,
  SpacePermissionDTO,
} from "@repo/shared-types";
import { z } from "zod";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type { SpaceGetByIdUseCase } from "@/application/port/in/space-get-by-id-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";

const spaceGetByIdController: FastifyControllerInterface<
  SpaceGetByIdUseCase
> = (fastify, spaceGetByIdUseCase) => {
  fastify.route({
    method: "GET",
    url: "/space/:spaceId",
    schema: {
      summary: "嘗試取得指定空間",
      tags: ["Space"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        spaceId: z.string(),
      }),
      response: {
        200: SpaceGetByIdResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      try {
        const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
        const spaceId = request.params.spaceId;
        const space = await spaceGetByIdUseCase({
          accountId: accountToken?.accountId,
          spaceId,
        });
        const spaceDto: SpaceDto | null = space
          ? {
              ...space,
              permission: SpacePermissionDTO[space.permission],
            }
          : null;

        return {
          space: spaceDto,
        };
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default spaceGetByIdController;
