import { z } from "zod";

export const SpaceCardCreateRequestDTOSchema = z.object({
  targetCardId: z.string(),
  x: z.number(),
  y: z.number(),
});

export type SpaceCardCreateRequestDTO = z.infer<
  typeof SpaceCardCreateRequestDTOSchema
>;
