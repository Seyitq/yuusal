import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const categoryRepository = {
  findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: { children: true, parent: true },
    });
  },

  findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { children: true, parent: true },
    });
  },

  findAll() {
    return prisma.category.findMany({
      include: { children: true, parent: true },
      orderBy: { order: "asc" },
    });
  },

  findActiveMenuCategories() {
    return prisma.category.findMany({
      where: { isActive: true, showInMenu: true },
      include: {
        children: {
          where: { isActive: true, showInMenu: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });
  },

  create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  },

  update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
