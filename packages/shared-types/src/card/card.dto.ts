import z from "zod";

export enum CardPermissionDTO {
  Private = "Private",
  PublicReadOnly = "PublicReadOnly",
  PublicEditable = "PublicEditable",
}

export const CardPermissionDTOSchema = z.enum([
  CardPermissionDTO.Private,
  CardPermissionDTO.PublicReadOnly,
  CardPermissionDTO.PublicEditable,
]);

export enum CardTypeDTO {
  note = "note",
  book = "book",
  outline = "outline",
}

export const CardTypeDTOSchema = z.enum([
  CardTypeDTO.note,
  CardTypeDTO.book,
  CardTypeDTO.outline,
]);

export const LLMDataDTOSchema = z.object({
  id: z.string(),
  description: z.string(),
  prompt: z.string(),
  input: z.string(),
  model: z.string(),
  completion: z.string(),
  cost: z.number(),
  useTime: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable().optional(),
});

export const cardDtoSchema = z.object({
  id: z.string(),
  belongAccountId: z.string(),
  permission: CardPermissionDTOSchema,
  title: z.string(),
  snapshotContent: z.string(),
  modifyContent: z.string(),
  width: z.number(),
  height: z.number(),
  isSizeFitContent: z.boolean(),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      key: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
      deletedAt: z.string().nullable().optional(),
    })
  ),
  drawings: z.array(
    z.object({
      id: z.string(),
      lines: z.array(
        z.object({
          strokeId: z.string(),
          color: z.string(),
          width: z.number(),
          startX: z.number(),
          startY: z.number(),
          endX: z.number(),
          endY: z.number(),
        })
      ),
    })
  ),
  type: CardTypeDTOSchema,
  llmData: LLMDataDTOSchema.nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable().optional(),
});

export type CardDto = z.infer<typeof cardDtoSchema>;
