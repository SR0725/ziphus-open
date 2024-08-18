import { z } from "zod";
import { SpaceCardDTOSchema } from "./space.dto";
import { cardDtoSchema } from "..";

export const SpaceCardListGetBySpaceIdResponseDTOSchema = z.object({
  spaceCards: z.array(
    z
      .object({
        card: cardDtoSchema.nullable(),
      })
      .merge(SpaceCardDTOSchema)
  ),
});

export type SpaceCardListGetBySpaceIdResponseDTO = z.infer<
  typeof SpaceCardListGetBySpaceIdResponseDTOSchema
>;
