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

const spaceCardGenerateFromMarkdownUseController: FastifyControllerInterface<
  [SpaceCardGenerateWithMarkdownUseCase, EmitSocketPort]
> = (fastify, [spaceCardGenerateWithMarkdownUseCase, emitSocket]) => {
  fastify.route({
    method: "POST",
    url: "/space/:spaceId/space-card/from-md",
    schema: {
      summary: "嘗試透過 markdown 切割成完整的卡片串",
      tags: ["SpaceCard"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        spaceId: z.string(),
      }),
      body: z.object({
        text: z.string(),
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
      const { text } = request.body;

      try {
        const markdown = markdownSplit(text);
        const spaceCards = await spaceCardGenerateWithMarkdownUseCase({
          accountId: accountToken!.accountId,
          spaceId: targetSpaceId,
          markdown: markdown,
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

export default spaceCardGenerateFromMarkdownUseController;
