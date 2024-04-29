import { z } from "zod";

export const AccountMeResponseDTOSchema = z.object({
  id: z.string(),
  googleId: z.string().nullable(),
  email: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type AccountMeResponseDTO = z.infer<typeof AccountMeResponseDTOSchema>;
