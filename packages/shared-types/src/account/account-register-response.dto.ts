import { z } from "zod";

export const AccountRegisterResponseDTOSchema = z.object({
  authorization: z.string(),
});

export type AccountRegisterResponseDTO = z.infer<
  typeof AccountRegisterResponseDTOSchema
>;
