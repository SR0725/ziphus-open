import {
  AccountLoginWithEmailRequestDTOSchema,
  AccountLoginWithEmailResponseDTOSchema,
} from "@repo/shared-types";
import type { AccountLoginWithEmailUseCase } from "@/application/port/in/account-login-with-email-use-case";
import type FastifyControllerInterface from "./fastify-controller-interface";

const accountLoginWithEmailController: FastifyControllerInterface<
  AccountLoginWithEmailUseCase
> = (fastify, accountLoginWithEmailUseCase) => {
  fastify.route({
    method: "POST",
    url: "/account/login-with-email",
    schema: {
      summary: "使用 Email 與密碼登入帳號",
      tags: ["Account"],
      body: AccountLoginWithEmailRequestDTOSchema,
      response: {
        200: AccountLoginWithEmailResponseDTOSchema,
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;
      try {
        const authorization = await accountLoginWithEmailUseCase({
          email,
          password,
        });
        return {
          authorization,
        };
      } catch (error) {
        reply.code(400);
        console.error(error);
        throw error;
      }
    },
  });
};

export default accountLoginWithEmailController;
