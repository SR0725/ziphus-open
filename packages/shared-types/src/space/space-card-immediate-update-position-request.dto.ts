import { z } from "zod";

export const SpaceCardImmediateUpdatePositionRequestDTOSchema = z.object({
  spaceId: z.string(),
  spaceCardId: z.string(),
  x: z.number(),
  y: z.number(),
});

export type SpaceCardImmediateUpdatePositionRequestDTO = z.infer<
  typeof SpaceCardImmediateUpdatePositionRequestDTOSchema
>;
