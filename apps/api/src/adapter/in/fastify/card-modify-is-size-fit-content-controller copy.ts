import {
  OptionalAuthorizationHeaderSchema,
  CardModifyIsSizeFitContentRequestDTOSchema,
} from "@repo/shared-types";
import { z } from "zod";
import type { CardModifyIsSizeFitContentUseCase } from "@/application/port/in/card-modify-is-size-fit-content-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type { EmitSocketPort } from "@/application/port/out/emit-socket-port";
import type FastifyControllerInterface from "./fastify-controller-interface";

const cardModifyIsSizeFitContentController: FastifyControllerInterface<
  [CardModifyIsSizeFitContentUseCase, EmitSocketPort]
> = (fastify, [cardModifyIsSizeFitContentUseCase, emitSocket]) => {
  fastify.route({
    method: "PUT",
    url: "/card/:id/is-size-fit-content",
    schema: {
      summary: "嘗試修改卡片是否符合內容大小",
      tags: ["Card"],
      headers: OptionalAuthorizationHeaderSchema,
      params: z.object({
        id: z.string(),
      }),
      body: CardModifyIsSizeFitContentRequestDTOSchema,
      response: {
        200: z.boolean(),
      },
    },
    handler: async (request, reply) => {
      const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
      const cardId = request.params.id;
      const isSizeFitContent = request.body.isSizeFitContent;

      try {
        await cardModifyIsSizeFitContentUseCase({
          accountId: accountToken?.accountId,
          cardId,
          isSizeFitContent,
        });

        emitSocket({
          event: `card:${cardId}:is-size-fit-content-modified`,
          data: {
            isSizeFitContent,
          },
        }); 
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default cardModifyIsSizeFitContentController;
