import { z } from "zod";

export const CardAddImageRequestDTOSchema = z.object({
  key: z.string(),
  url: z.string(),
  bytes: z.number(),
});

export type CardAddImageRequestDTO = z.infer<
  typeof CardAddImageRequestDTOSchema
>;
