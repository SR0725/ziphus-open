import {
  AuthorizationHeaderSchema,
  AccountMeResponseDTOSchema,
} from "@repo/shared-types";
import type { AccountGetInfoUseCase } from "@/application/port/in/account-get-info-use-case";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type FastifyControllerInterface from "./fastify-controller-interface";

const accountMeController: FastifyControllerInterface<AccountGetInfoUseCase> = (
  fastify,
  accountGetInfoUseCase
) => {
  fastify.route({
    method: "GET",
    url: "/account/me",
    schema: {
      summary: "取得本人帳號",
      tags: ["Account"],
      headers: AuthorizationHeaderSchema,
      response: {
        200: AccountMeResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      try {
        const accountToken = getAccountTokenInterfaceFromAuth(request.headers);
        if (!accountToken) {
          return reply.code(401).send();
        }
        const account = await accountGetInfoUseCase({
          accountId: accountToken.accountId,
        });

        return {
          ...account,
          hashedPassword: undefined,
        };
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default accountMeController;
