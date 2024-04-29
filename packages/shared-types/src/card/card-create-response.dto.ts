import { z } from "zod";
import { cardDtoSchema } from "./card.dto";

export const CardCreateResponseDTOSchema = z.object({
  card: cardDtoSchema,
});

export type CardCreateResponseDTO = z.infer<typeof CardCreateResponseDTOSchema>;
