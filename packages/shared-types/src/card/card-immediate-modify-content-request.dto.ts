import { z } from "zod";

export const CardGetIsNeedImmediateModifyContentRequestDTOSchema = z.object({
  cardId: z.string(),
});

export const CardImmediateModifyContentRequestDTOSchema = z.object({
  cardId: z.string(),
  content: z.string(),
});

export type CardImmediateModifyContentRequestDTO = z.infer<
  typeof CardImmediateModifyContentRequestDTOSchema
>;

export type CardGetIsNeedImmediateModifyContentRequestDTO = z.infer<
  typeof CardGetIsNeedImmediateModifyContentRequestDTOSchema
>;
