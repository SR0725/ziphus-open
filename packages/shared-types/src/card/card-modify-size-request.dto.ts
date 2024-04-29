import { z } from "zod";

export const CardModifySizeRequestDTOSchema = z.object({
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

export type CardModifySizeRequestDTO = z.infer<
  typeof CardModifySizeRequestDTOSchema
>;
