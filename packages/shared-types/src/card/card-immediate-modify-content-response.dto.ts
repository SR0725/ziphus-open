import { z } from "zod";

export const CardGetIsNeedImmediateModifyContentResponseDTOSchema = z.object({
  available: z.boolean(),
});

export type CardGetIsNeedImmediateModifyContentResponseDTO = z.infer<
  typeof CardGetIsNeedImmediateModifyContentResponseDTOSchema
>;