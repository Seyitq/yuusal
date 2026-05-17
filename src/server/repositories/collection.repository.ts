import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const collectionRepository = {
  findBySlug(slug: string) {
    return prisma.collection.findUnique({ where: { slug } });
  },

  findAllActive() {
    return prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  },

  findAll() {
    return prisma.collection.findMany({ orderBy: { createdAt: "desc" } });
  },

  findFeatured() {
    return prisma.collection.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
    });
  },

  create(data: Prisma.CollectionCreateInput) {
    return prisma.collection.create({ data });
  },

  update(id: string, data: Prisma.CollectionUpdateInput) {
    return prisma.collection.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.collection.delete({ where: { id } });
  },
};
