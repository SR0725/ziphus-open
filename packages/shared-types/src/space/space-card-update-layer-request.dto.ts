import { z } from "zod";

export const SpaceCardUpdateLayerRequestDTOSchema = z.object({
  operation: z.union([
    z.literal("top"),
    z.literal("bottom"),
    z.literal("up"),
    z.literal("down"),
  ]),
});

export type SpaceCardUpdateLayerRequestDTO = z.infer<
  typeof SpaceCardUpdateLayerRequestDTOSchema
>;
