import { z } from "zod";
import { CardPermissionDTOSchema } from "./card.dto";

export const CardModifyPermissionRequestDTOSchema = z.object({
  permission: CardPermissionDTOSchema,
});

export type CardModifyPermissionRequestDTO = z.infer<
  typeof CardModifyPermissionRequestDTOSchema
>;
