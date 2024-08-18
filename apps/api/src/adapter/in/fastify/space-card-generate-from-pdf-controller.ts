import {
  OptionalAuthorizationHeaderSchema,
  SpaceCardDTOSchema,
} from "@repo/shared-types";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";
import { SpaceCardGenerateWithMarkdownUseCase } from "@/application/port/in/space-card-generate-with-markdown-use-case";
import z from "zod";
import { EmitSocketPort } from "@/application/port/out/emit-socket-port";
import markdownSplit from "@/common/markdown-split";
import getMarkdownFromPdf from "@/common/getMarkdownFromPdf";

const spaceCardGenerateFromPdfUseController: FastifyControllerInterface<
  [SpaceCardGenerateWithMarkdownUseCase, EmitSocketPort]
> = (fastify, [spaceCardGenerateWithMarkdownUseCase, emitSocket]) => {
  fastify.route({
    method: "POST",
    url: "/space/:spaceId/space-card/from-pdf",
    schema: {
      summary: "嘗試透過 pdf 切割成完整的卡片串",
      tags: ["SpaceCard"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        spaceId: z.string(),
      }),
      response: {
        200: SpaceCardDTOSchema.array(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      if (!accountToken) {
        reply.code(401);
        throw new Error("Unauthorized");
      }
      const targetSpaceId = request.params.spaceId;

      try {
        const data = await request.file();
        const text = await getMarkdownFromPdf(data);
        const markdown = markdownSplit(text);
        const spaceCards = await spaceCardGenerateWithMarkdownUseCase({
          accountId: accountToken!.accountId,
          spaceId: targetSpaceId,
          markdown,
        });
        emitSocket({
          event: "space:card:list:create",
          data: {
            spaceCards,
          },
          room: targetSpaceId,
        });
        return spaceCards;
      } catch (error) {
        console.error(error);
        return reply.code(500);
      }
    },
  });
};

export default spaceCardGenerateFromPdfUseController;
