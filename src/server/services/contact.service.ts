import { contactRepository } from "@/server/repositories/contact.repository";
import { z } from "zod";

export const contactCreateSchema = z.object({
  name: z.string().min(2, "Adınızı giriniz."),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Mesajınız en az 10 karakter olmalıdır."),
});

export type ContactCreateInput = z.infer<typeof contactCreateSchema>;

export const contactService = {
  async submit(input: ContactCreateInput) {
    return contactRepository.create(input);
  },

  getAll(args?: { skip?: number; take?: number; isRead?: boolean }) {
    return contactRepository.findAll(args);
  },

  countUnread() {
    return contactRepository.countUnread();
  },

  markRead(id: string) {
    return contactRepository.markRead(id);
  },

  markReplied(id: string) {
    return contactRepository.markReplied(id);
  },

  updateNotes(id: string, notes: string) {
    return contactRepository.updateNotes(id, notes);
  },

  delete(id: string) {
    return contactRepository.delete(id);
  },
};
