import { categoryRepository } from "@/server/repositories/category.repository";
import { generateUniqueSlug } from "@/lib/slugify";
import type { CategoryCreateInput, CategoryUpdateInput } from "@/server/schemas/category.schema";
import { prisma } from "@/lib/prisma";

export const categoryService = {
  getBySlug(slug: string) {
    return categoryRepository.findBySlug(slug);
  },

  getById(id: string) {
    return categoryRepository.findById(id);
  },

  getAll() {
    return categoryRepository.findAll();
  },

  getMenuCategories() {
    return categoryRepository.findActiveMenuCategories();
  },

  async create(input: CategoryCreateInput) {
    const slug = input.slug ?? (await generateUniqueSlug(
      input.name,
      async (s) => (await prisma.category.count({ where: { slug: s } })) > 0,
    ));

    return categoryRepository.create({
      ...input,
      slug,
      ...(input.parentId && { parent: { connect: { id: input.parentId } } }),
    });
  },

  update(id: string, input: CategoryUpdateInput) {
    return categoryRepository.update(id, input);
  },

  delete(id: string) {
    return categoryRepository.delete(id);
  },
};
