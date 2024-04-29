import { z } from "zod";

export const SpaceCardUpdateLayerResponseDTOSchema = z.string().array();

export type SpaceCardUpdateLayerResponseDTO = z.infer<
  typeof SpaceCardUpdateLayerResponseDTOSchema
>;
