import { z } from "zod";
import { cardDtoSchema } from "./card.dto";

export const CardGetWithAllResponseDTOSchema = z.object({
  cards: cardDtoSchema.array(),
});

export type CardGetWithAllResponseDTO = z.infer<
  typeof CardGetWithAllResponseDTOSchema
>;
