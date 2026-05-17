import { z } from "zod";

export const categoryCreateSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  parentId: z.string().cuid().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  showInMenu: z.boolean().default(true),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
