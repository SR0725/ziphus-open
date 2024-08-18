import { z } from "zod";

export const LinkSpaceCardConnectRequestDTOSchema = z.object({
  startSpaceCardId: z.string(),
  startSpaceCardDirection: z.union([
    z.literal("top"),
    z.literal("right"),
    z.literal("bottom"),
    z.literal("left"),
  ]),
  endSpaceCardId: z.string(),
  endSpaceCardDirection: z.union([
    z.literal("top"),
    z.literal("right"),
    z.literal("bottom"),
    z.literal("left"),
  ]),
});

export type LinkSpaceCardConnectRequestDTO = z.infer<
  typeof LinkSpaceCardConnectRequestDTOSchema
>;
