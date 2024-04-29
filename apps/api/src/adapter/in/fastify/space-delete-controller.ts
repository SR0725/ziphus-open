import {
  AuthorizationHeaderSchema,
  SpacePermissionDTO,
} from "@repo/shared-types";
import z from "zod";
import type { SpaceDeleteUseCase } from "@/application/port/in/space-delete-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";

const spaceDeleteController: FastifyControllerInterface<SpaceDeleteUseCase> = (
  fastify,
  spaceDeleteUseCase
) => {
  fastify.route({
    method: "DELETE",
    url: "/space/:spaceId",
    schema: {
      summary: "刪除空間",
      tags: ["Space"],
      headers: AuthorizationHeaderSchema,
      params: z.object({
        spaceId: z.string(),
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
      const spaceId = request.params.spaceId;

      try {
        return await spaceDeleteUseCase({
          accountId: accountToken.accountId,
          spaceId,
        });
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default spaceDeleteController;
