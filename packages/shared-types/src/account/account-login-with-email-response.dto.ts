import { z } from "zod";

export const AccountLoginWithEmailResponseDTOSchema = z.object({
  authorization: z.string(),
});

export type AccountLoginWithEmailResponseDTO = z.infer<
  typeof AccountLoginWithEmailResponseDTOSchema
>;
