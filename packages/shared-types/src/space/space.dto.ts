import z from "zod";

export enum SpacePermissionDTO {
  Private = "Private",
  PublicReadOnly = "PublicReadOnly",
  PublicEditable = "PublicEditable",
}

export const SpacePermissionDTOSchema = z.enum([
  SpacePermissionDTO.Private,
  SpacePermissionDTO.PublicReadOnly,
  SpacePermissionDTO.PublicEditable,
]);

export const SpaceCardDTOSchema = z.object({
  id: z.string(),
  targetCardId: z.string(),
  targetSpaceId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const ChildSpaceDTOSchema = z.object({
  id: z.string(),
  targetSpaceId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const SpaceDtoSchema = z.object({
  id: z.string(),
  belongAccountId: z.string(),
  title: z.string(),
  permission: SpacePermissionDTOSchema,
  layers: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type SpaceDto = z.infer<typeof SpaceDtoSchema>;
export type SpaceCardDTO = z.infer<typeof SpaceCardDTOSchema>;
export type ChildSpaceDTO = z.infer<typeof ChildSpaceDTOSchema>;
