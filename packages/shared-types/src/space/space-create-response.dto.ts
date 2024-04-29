import { z } from "zod";
import { SpaceDtoSchema } from "./space.dto";

export const SpaceCreateResponseDTOSchema = z.object({
  space: SpaceDtoSchema,
});

export type SpaceCreateResponseDTO = z.infer<
  typeof SpaceCreateResponseDTOSchema
>;
