import { z } from "zod";

export const AccountRegisterRequestDTOSchema = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export type AccountRegisterRequestDTO = z.infer<
  typeof AccountRegisterRequestDTOSchema
>;
