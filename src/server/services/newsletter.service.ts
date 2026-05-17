import { newsletterRepository } from "@/server/repositories/newsletter.repository";
import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  source: z.string().optional(),
  consent: z.literal(true, {
    error: "E-posta listesine eklenmeyi kabul etmelisiniz.",
  }),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;

export const newsletterService = {
  async subscribe(input: NewsletterSubscribeInput) {
    return newsletterRepository.subscribe(input.email, input.source);
  },

  unsubscribe(email: string) {
    return newsletterRepository.unsubscribe(email);
  },

  getAll(args?: { skip?: number; take?: number }) {
    return newsletterRepository.findAll(args);
  },

  count() {
    return newsletterRepository.count();
  },
};
