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
import { LLMModel } from "@/application/port/in/llm-model";

const spaceCreateWithMarkdownController: FastifyControllerInterface<
  SpaceCreateWithBookUseCase
> = (fastify, spaceCreateWithBookUseCase) => {
  fastify.route({
    method: "POST",
    url: "/space/with-markdown",
    schema: {
      summary: "透過 markdown 建立書籍空間",
      tags: ["Space"],
      headers: AuthorizationHeaderSchema,
      body: z.object({
        text: z.string(),
        developerSetting: z
          .object({
            outlinePrompt: z.string().optional(),
            splitCardPrompt: z.string().optional(),
            useLLM: z
              .enum([
                LLMModel.GPT4,
                LLMModel.GPT3,
                LLMModel.CLAUDE_SONNET,
                LLMModel.CLAUDE_HAIKU,
              ])
              .optional(),
          })
          .optional(),
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
      const { text, developerSetting } = request.body;

      try {
        const pagesMarkdown = markdownSplit(text);

        const space = await spaceCreateWithBookUseCase({
          accountId: accountToken.accountId,
          pagesMarkdown,
          developerSetting,
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

export default spaceCreateWithMarkdownController;
