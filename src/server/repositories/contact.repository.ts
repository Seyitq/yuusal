import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const contactRepository = {
  create(data: Prisma.ContactMessageCreateInput) {
    return prisma.contactMessage.create({ data });
  },

  findAll(args?: { skip?: number; take?: number; isRead?: boolean }) {
    return prisma.contactMessage.findMany({
      where: { ...(args?.isRead !== undefined && { isRead: args.isRead }) },
      orderBy: { createdAt: "desc" },
      skip: args?.skip,
      take: args?.take,
    });
  },

  countUnread() {
    return prisma.contactMessage.count({ where: { isRead: false } });
  },

  markRead(id: string) {
    return prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  },

  markReplied(id: string) {
    return prisma.contactMessage.update({
      where: { id },
      data: { isRead: true, isReplied: true },
    });
  },

  updateNotes(id: string, notes: string) {
    return prisma.contactMessage.update({ where: { id }, data: { notes } });
  },

  delete(id: string) {
    return prisma.contactMessage.delete({ where: { id } });
  },
};
