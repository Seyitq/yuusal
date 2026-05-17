import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const blogRepository = {
  findBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { name: true } } },
    });
  },

  findById(id: string) {
    return prisma.blogPost.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    });
  },

  findAllPublished(args?: { skip?: number; take?: number }) {
    return prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      skip: args?.skip,
      take: args?.take,
      include: { author: { select: { name: true } } },
    });
  },

  findAll(args?: { skip?: number; take?: number }) {
    return prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      skip: args?.skip,
      take: args?.take,
      include: { author: { select: { name: true } } },
    });
  },

  create(data: Prisma.BlogPostCreateInput) {
    return prisma.blogPost.create({ data });
  },

  update(id: string, data: Prisma.BlogPostUpdateInput) {
    return prisma.blogPost.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.blogPost.delete({ where: { id } });
  },
};
