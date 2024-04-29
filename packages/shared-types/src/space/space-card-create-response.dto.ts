import { z } from "zod";
import { SpaceCardDTOSchema } from "./space.dto";

export const SpaceCardCreateResponseDTOSchema = z.object({
  spaceCard: SpaceCardDTOSchema,
});

export type SpaceCardCreateResponseDTO = z.infer<
  typeof SpaceCardCreateResponseDTOSchema
>;
