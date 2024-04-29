import { z } from "zod";
import { cardDtoSchema } from "./card.dto";

export const CardGetByIdResponseDTOSchema = z.object({
  card: cardDtoSchema.nullable(),
});

export type CardGetByIdResponseDTO = z.infer<
  typeof CardGetByIdResponseDTOSchema
>;
