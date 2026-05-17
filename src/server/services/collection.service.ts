import { collectionRepository } from "@/server/repositories/collection.repository";

export const collectionService = {
  getBySlug(slug: string) {
    return collectionRepository.findBySlug(slug);
  },

  getAllActive() {
    return collectionRepository.findAllActive();
  },

  getAll() {
    return collectionRepository.findAll();
  },

  getFeatured() {
    return collectionRepository.findFeatured();
  },

  create(data: Parameters<typeof collectionRepository.create>[0]) {
    return collectionRepository.create(data);
  },

  update(id: string, data: Parameters<typeof collectionRepository.update>[1]) {
    return collectionRepository.update(id, data);
  },

  delete(id: string) {
    return collectionRepository.delete(id);
  },
};
