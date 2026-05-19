import { z } from "zod";

const productImageInputSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
  order: z.number().int().default(0),
  isPrimary: z.boolean().default(false),
});

export const productCreateSchema = z.object({
  sku: z.string().min(3).max(50),
  name: z.string().min(2).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  shortDesc: z.string().max(300).optional(),
  categoryId: z.string().cuid(),
  collectionId: z.string().cuid().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  composition: z.string().optional(),
  careInfo: z.string().optional(),
  dimensions: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  order: z.number().int().default(0),
  price: z.number().int().min(0).optional().nullable(),
  priceOld: z.number().int().min(0).optional().nullable(),
  images: z.array(productImageInputSchema).optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
