import { z } from "zod";

export const CardModifyTitleRequestDTOSchema = z.object({
  title: z.string(),
});

export type CardModifyTitleRequestDTO = z.infer<
  typeof CardModifyTitleRequestDTOSchema
>;
