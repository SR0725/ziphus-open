import { z } from "zod";
import { SpaceDtoSchema } from "./space.dto";

export const SpaceGetByIdResponseDTOSchema = z.object({
  space: SpaceDtoSchema.nullable(),
});

export type SpaceGetByIdResponseDTO = z.infer<
  typeof SpaceGetByIdResponseDTOSchema
>;
