import {
  AuthorizationHeaderSchema,
  SpaceGetWithAllResponseDTOSchema,
  SpacePermissionDTO,
} from "@repo/shared-types";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type { SpaceGetWithAllUseCase } from "@/application/port/in/space-get-with-all-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";

const spaceGetWithAllController: FastifyControllerInterface<
  SpaceGetWithAllUseCase
> = (fastify, spaceGetWithAllUseCase) => {
  fastify.route({
    method: "GET",
    url: "/spaces",
    schema: {
      summary: "取得個人的所有空間",
      tags: ["Space"],
      headers: AuthorizationHeaderSchema,
      response: {
        200: SpaceGetWithAllResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }

      try {
        const spaces = await spaceGetWithAllUseCase({
          accountId: accountToken.accountId,
        });
        const spacesDto = spaces.map((space) => ({
          ...space,
          permission: SpacePermissionDTO[space.permission],
        }));

        return {
          spaces: spacesDto,
        };
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default spaceGetWithAllController;
