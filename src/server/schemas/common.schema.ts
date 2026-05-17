import { z } from "zod";

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(24),
});

// Sıralama
export const sortSchema = z.enum(["newest", "oldest", "az", "za"]).default("newest");

// Slug params
export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

// ID params
export const idParamSchema = z.object({
  id: z.string().cuid(),
});

export type Pagination = z.infer<typeof paginationSchema>;
export type Sort = z.infer<typeof sortSchema>;
