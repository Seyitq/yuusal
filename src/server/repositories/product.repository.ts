import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const productRepository = {
  findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        collection: true,
        variants: { include: { images: true }, orderBy: { order: "asc" } },
        images: { orderBy: { order: "asc" } },
        tags: { include: { tag: true } },
      },
    });
  },

  findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        collection: true,
        variants: { include: { images: true }, orderBy: { order: "asc" } },
        images: { orderBy: { order: "asc" } },
        tags: { include: { tag: true } },
      },
    });
  },

  findManyActive(args: {
    skip?: number;
    take?: number;
    categoryId?: string;
    collectionId?: string;
    featured?: boolean;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        ...(args.categoryId && { categoryId: args.categoryId }),
        ...(args.collectionId && { collectionId: args.collectionId }),
        ...(args.featured !== undefined && { isFeatured: args.featured }),
      },
      include: {
        images: { where: { isMain: true }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy ?? { createdAt: "desc" },
    });
  },

  countActive(args: { categoryId?: string; collectionId?: string }) {
    return prisma.product.count({
      where: {
        isActive: true,
        ...(args.categoryId && { categoryId: args.categoryId }),
        ...(args.collectionId && { collectionId: args.collectionId }),
      },
    });
  },

  findAll(args: {
    skip?: number;
    take?: number;
    search?: string;
    categoryId?: string;
    collectionId?: string;
    isActive?: boolean;
  }) {
    return prisma.product.findMany({
      where: {
        ...(args.isActive !== undefined && { isActive: args.isActive }),
        ...(args.categoryId && { categoryId: args.categoryId }),
        ...(args.collectionId && { collectionId: args.collectionId }),
        ...(args.search && {
          OR: [
            { name: { contains: args.search, mode: "insensitive" } },
            { sku: { contains: args.search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        images: { where: { isMain: true }, take: 1 },
        category: { select: { name: true, slug: true } },
        collection: { select: { name: true, slug: true } },
      },
      skip: args.skip,
      take: args.take,
      orderBy: { createdAt: "desc" },
    });
  },

  create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data });
  },

  update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },
};
