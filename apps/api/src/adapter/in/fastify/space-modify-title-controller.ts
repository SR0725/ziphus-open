import { OptionalAuthorizationHeaderSchema } from "@repo/shared-types";
import { z } from "zod";
import type { SpaceModifyTitleUseCase } from "@/application/port/in/space-modify-title-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";

const spaceModifyTitleController: FastifyControllerInterface<
  SpaceModifyTitleUseCase
> = (fastify, spaceModifyTitleUseCase) => {
  fastify.route({
    method: "PUT",
    url: "/space/:id/title",
    schema: {
      summary: "嘗試修改空間標題",
      tags: ["Space"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        id: z.string(),
      }),
      body: z.object({
        title: z.string(),
      }),
      response: {
        200: z.boolean(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const spaceId = request.params.id;
      const title = request.body.title;

      try {
        return await spaceModifyTitleUseCase({
          accountId: accountToken?.accountId,
          spaceId,
          title,
        });
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default spaceModifyTitleController;
