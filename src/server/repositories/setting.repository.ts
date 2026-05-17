import { prisma } from "@/lib/prisma";

export const settingRepository = {
  get(key: string) {
    return prisma.siteSetting.findUnique({ where: { key } });
  },

  getMany(keys: string[]) {
    return prisma.siteSetting.findMany({ where: { key: { in: keys } } });
  },

  getAll() {
    return prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  },

  set(key: string, value: string) {
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  },

  setMany(entries: { key: string; value: string }[]) {
    return Promise.all(entries.map((e) => settingRepository.set(e.key, e.value)));
  },
};
