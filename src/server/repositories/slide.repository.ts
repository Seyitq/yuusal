import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const slideRepository = {
  findAllActive() {
    return prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  },

  findAll() {
    return prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  },

  findById(id: string) {
    return prisma.heroSlide.findUnique({ where: { id } });
  },

  create(data: Prisma.HeroSlideCreateInput) {
    return prisma.heroSlide.create({ data });
  },

  update(id: string, data: Prisma.HeroSlideUpdateInput) {
    return prisma.heroSlide.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.heroSlide.delete({ where: { id } });
  },
};
