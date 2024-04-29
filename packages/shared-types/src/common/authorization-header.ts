import { z } from "zod";

export const AuthorizationHeaderSchema = z.object({
  authorization: z.string(),
});

export const OptionalAuthorizationHeaderSchema = z.object({
  authorization: z.string().nullable(),
});

export type Authorization = z.infer<typeof AuthorizationHeaderSchema>;
export type OptionalAuthorization = z.infer<
  typeof OptionalAuthorizationHeaderSchema
>;
