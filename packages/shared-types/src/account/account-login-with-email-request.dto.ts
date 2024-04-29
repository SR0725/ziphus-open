import { z } from "zod";

export const AccountLoginWithEmailRequestDTOSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type AccountLoginWithEmailRequestDTO = z.infer<
  typeof AccountLoginWithEmailRequestDTOSchema
>;
