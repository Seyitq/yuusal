import { prisma } from "@/lib/prisma";

export const newsletterRepository = {
  subscribe(email: string, source?: string) {
    return prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true, unsubscribedAt: null },
      create: { email, source, isActive: true },
    });
  },

  unsubscribe(email: string) {
    return prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false, unsubscribedAt: new Date() },
    });
  },

  findAll(args?: { skip?: number; take?: number }) {
    return prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { subscribedAt: "desc" },
      skip: args?.skip,
      take: args?.take,
    });
  },

  count() {
    return prisma.newsletterSubscriber.count({ where: { isActive: true } });
  },
};
