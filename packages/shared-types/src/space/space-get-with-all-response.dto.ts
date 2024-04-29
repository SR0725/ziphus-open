import { z } from "zod";
import { SpaceDtoSchema } from "./space.dto";

export const SpaceGetWithAllResponseDTOSchema = z.object({
  spaces: z.array(SpaceDtoSchema),
});

export type SpaceGetWithAllResponseDTO = z.infer<
  typeof SpaceGetWithAllResponseDTOSchema
>;
