import {
  AuthorizationHeaderSchema,
  CardModifyPermissionRequestDTOSchema,
} from "@repo/shared-types";
import { z } from "zod";
import type { CardModifyPermissionUseCase } from "@/application/port/in/card-modify-permission-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";

const cardModifyPermissionController: FastifyControllerInterface<
  CardModifyPermissionUseCase
> = (fastify, cardModifyPermissionUseCase) => {
  fastify.route({
    method: "PUT",
    url: "/card/:id/permission",
    schema: {
      summary: "修改卡片讀取權限",
      tags: ["Card"],
      headers: AuthorizationHeaderSchema,
      params: z.object({
        id: z.string(),
      }),
      body: CardModifyPermissionRequestDTOSchema,
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
      const permission = request.body.permission;

      try {
        return await cardModifyPermissionUseCase({
          accountId: accountToken.accountId,
          cardId,
          permission,
        });
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default cardModifyPermissionController;
