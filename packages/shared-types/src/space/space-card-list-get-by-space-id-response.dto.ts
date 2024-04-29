import { z } from "zod";
import { SpaceCardDTOSchema } from "./space.dto";
import { cardDtoSchema } from "..";

export const SpaceCardListGetBySpaceIdResponseDTOSchema = z.object({
  spaceCards: z.array(
    z.object({
      id: z.string(),
      targetCardId: z.string(),
      targetSpaceId: z.string(),
      x: z.number(),
      y: z.number(),
      card: cardDtoSchema.nullable(),
    })
  ),
});

export type SpaceCardListGetBySpaceIdResponseDTO = z.infer<
  typeof SpaceCardListGetBySpaceIdResponseDTOSchema
>;
