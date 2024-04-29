import { z } from "zod";

export const CardModifyContentRequestDTOSchema = z.object({
  content: z.string(),
});

export type CardModifyContentRequestDTO = z.infer<
  typeof CardModifyContentRequestDTOSchema
>;
