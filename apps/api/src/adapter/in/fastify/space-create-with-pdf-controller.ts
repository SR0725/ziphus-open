import {
  AuthorizationHeaderSchema,
  SpaceCreateResponseDTOSchema,
  SpacePermissionDTO,
} from "@repo/shared-types";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";
import getMarkdownFromPdf from "@/common/getMarkdownFromPdf";
import markdownSplit from "@/common/markdown-split";
import { SpaceCreateWithBookUseCase } from "@/application/port/in/space-create-with-book-use-case";
import z from "zod";

const spaceCreateWithPDFController: FastifyControllerInterface<
  SpaceCreateWithBookUseCase
> = (fastify, spaceCreateWithBookUseCase) => {
  fastify.route({
    method: "POST",
    url: "/space/with-pdf",
    schema: {
      summary: "透過 pdf 建立書籍空間",
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
        const data = await request.file();
        const pdfMarkdown = data ? await getMarkdownFromPdf(data) : [];

        const pagesMarkdown = markdownSplit(pdfMarkdown);

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

export default spaceCreateWithPDFController;
