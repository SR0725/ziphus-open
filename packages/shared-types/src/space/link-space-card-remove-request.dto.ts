import { z } from "zod";

export const LinkSpaceCardRemoveDTOSchema = z.object({
  targetSpaceCardId: z.string(),
  linkLineId: z.string(),
});

export type LinkSpaceCardRemoveDTO = z.infer<
  typeof LinkSpaceCardRemoveDTOSchema
>;
