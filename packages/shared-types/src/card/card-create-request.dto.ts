import { z } from "zod";

export const CardCreateRequestDTOSchema = z.object({
  initialContent: z.string().optional(),
});

export type CardCreateRequestDTO = z.infer<typeof CardCreateRequestDTOSchema>;
