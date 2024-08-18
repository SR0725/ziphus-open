import {
  AuthorizationHeaderSchema,
  SpaceCreateResponseDTOSchema,
  SpacePermissionDTO,
} from "@repo/shared-types";
import type { SpaceCreateWithBookUseCase } from "@/application/port/in/space-create-with-book-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";
import z from "zod";
import markdownSplit from "@/common/markdown-split";
import getMarkdownFromUrl from "@/common/getMarkdownFromUrl";

const spaceCreateWithUrlController: FastifyControllerInterface<
  SpaceCreateWithBookUseCase
> = (fastify, spaceCreateWithBookUseCase) => {
  fastify.route({
    method: "POST",
    url: "/space/with-url",
    schema: {
      summary: "透過 url 建立書籍空間",
      tags: ["Space"],
      headers: AuthorizationHeaderSchema,
      body: z.object({
        url: z.string(),
      }),
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
      const { url } = request.body;

      try {
        const webMarkdown = await getMarkdownFromUrl(url);

        const pagesMarkdown = markdownSplit(webMarkdown);

        const space = await spaceCreateWithBookUseCase({
          accountId: accountToken.accountId,
          pagesMarkdown,
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

export default spaceCreateWithUrlController;
