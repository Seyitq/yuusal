import { blogRepository } from "@/server/repositories/blog.repository";
import { generateUniqueSlug } from "@/lib/slugify";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const blogCreateSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().optional(),
  content: z.string(),
  coverImage: z.string().optional(),
  isPublished: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export type BlogCreateInput = z.infer<typeof blogCreateSchema>;

export const blogService = {
  getBySlug(slug: string) {
    return blogRepository.findBySlug(slug);
  },

  getById(id: string) {
    return blogRepository.findById(id);
  },

  getPublished(args?: { skip?: number; take?: number }) {
    return blogRepository.findAllPublished(args);
  },

  getAll(args?: { skip?: number; take?: number }) {
    return blogRepository.findAll(args);
  },

  async create(input: BlogCreateInput, authorId?: string) {
    const slug = input.slug ?? (await generateUniqueSlug(
      input.title,
      async (s) => (await prisma.blogPost.count({ where: { slug: s } })) > 0,
    ));

    return blogRepository.create({
      ...input,
      slug,
      publishedAt: input.isPublished ? new Date() : null,
      ...(authorId && { author: { connect: { id: authorId } } }),
    });
  },

  update(id: string, data: Parameters<typeof blogRepository.update>[1]) {
    return blogRepository.update(id, data);
  },

  delete(id: string) {
    return blogRepository.delete(id);
  },
};
