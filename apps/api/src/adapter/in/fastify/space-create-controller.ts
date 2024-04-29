import {
  AuthorizationHeaderSchema,
  SpaceCreateResponseDTOSchema,
  SpacePermissionDTO,
} from "@repo/shared-types";
import type { SpaceCreateUseCase } from "@/application/port/in/space-create-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";

const spaceCreateController: FastifyControllerInterface<SpaceCreateUseCase> = (
  fastify,
  spaceCreateUseCase
) => {
  fastify.route({
    method: "POST",
    url: "/space",
    schema: {
      summary: "建立新空間",
      tags: ["Space"],
      headers: AuthorizationHeaderSchema,
      response: {
        200: SpaceCreateResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }

      try {
        const space = await spaceCreateUseCase({
          accountId: accountToken.accountId,
        });
        const spaceDto = {
          ...space,
          permission: SpacePermissionDTO[space.permission],
        };

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

export default spaceCreateController;
