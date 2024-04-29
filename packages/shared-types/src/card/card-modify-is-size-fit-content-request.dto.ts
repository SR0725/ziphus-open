import { z } from "zod";

export const CardModifyIsSizeFitContentRequestDTOSchema = z.object({
  isSizeFitContent: z.boolean(),
});

export type CardModifyIsSizeFitContentRequestDTO = z.infer<
  typeof CardModifyIsSizeFitContentRequestDTOSchema
>;
