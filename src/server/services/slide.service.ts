import { slideRepository } from "@/server/repositories/slide.repository";

export const slideService = {
  getActiveSlides() {
    return slideRepository.findAllActive();
  },

  getAll() {
    return slideRepository.findAll();
  },

  getById(id: string) {
    return slideRepository.findById(id);
  },

  create(data: Parameters<typeof slideRepository.create>[0]) {
    return slideRepository.create(data);
  },

  update(id: string, data: Parameters<typeof slideRepository.update>[1]) {
    return slideRepository.update(id, data);
  },

  delete(id: string) {
    return slideRepository.delete(id);
  },
};
