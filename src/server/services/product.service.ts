import { productRepository } from "@/server/repositories/product.repository";
import { generateUniqueSlug } from "@/lib/slugify";
import type { ProductCreateInput, ProductUpdateInput } from "@/server/schemas/product.schema";
import { prisma } from "@/lib/prisma";

export const productService = {
  async getBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product || !product.isActive) return null;
    return product;
  },

  async getById(id: string) {
    return productRepository.findById(id);
  },

  async listAll(args: { skip?: number; take?: number; search?: string; categoryId?: string; isActive?: boolean }) {
    const [products, total] = await Promise.all([
      productRepository.findAll(args),
      prisma.product.count({
        where: {
          ...(args.isActive !== undefined && { isActive: args.isActive }),
          ...(args.categoryId && { categoryId: args.categoryId }),
          ...(args.search && { OR: [{ name: { contains: args.search, mode: "insensitive" } }, { sku: { contains: args.search, mode: "insensitive" } }] }),
        },
      }),
    ]);
    return { products, total };
  },

  async listForCategory(args: {
    categorySlug: string;
    page: number;
    perPage: number;
    sort: "newest" | "oldest" | "az" | "za";
    collectionSlug?: string;
  }) {
    const category = await prisma.category.findUnique({
      where: { slug: args.categorySlug },
      select: { id: true },
    });
    if (!category) return { products: [], total: 0 };

    let collectionId: string | undefined;
    if (args.collectionSlug) {
      const col = await prisma.collection.findUnique({
        where: { slug: args.collectionSlug },
        select: { id: true },
      });
      collectionId = col?.id;
    }

    const orderBy =
      args.sort === "newest" ? { createdAt: "desc" as const }
      : args.sort === "oldest" ? { createdAt: "asc" as const }
      : args.sort === "az" ? { name: "asc" as const }
      : { name: "desc" as const };

    const [products, total] = await Promise.all([
      productRepository.findManyActive({
        categoryId: category.id,
        collectionId,
        skip: (args.page - 1) * args.perPage,
        take: args.perPage,
        orderBy,
      }),
      productRepository.countActive({ categoryId: category.id, collectionId }),
    ]);

    return { products, total };
  },

  async listForCollection(args: {
    collectionId: string;
    page: number;
    perPage: number;
    sort: "newest" | "oldest" | "az" | "za";
  }) {
    const orderBy =
      args.sort === "newest" ? { createdAt: "desc" as const }
      : args.sort === "oldest" ? { createdAt: "asc" as const }
      : args.sort === "az" ? { name: "asc" as const }
      : { name: "desc" as const };

    const [products, total] = await Promise.all([
      productRepository.findManyActive({
        collectionId: args.collectionId,
        skip: (args.page - 1) * args.perPage,
        take: args.perPage,
        orderBy,
      }),
      productRepository.countActive({ collectionId: args.collectionId }),
    ]);

    return { products, total };
  },

  async listFeatured(take = 8) {
    return productRepository.findManyActive({ featured: true, take });
  },

  async listNewest(take = 8) {
    return productRepository.findManyActive({ take });
  },

  async create(input: ProductCreateInput) {
    const slug = input.slug ?? (await generateUniqueSlug(
      input.name,
      async (s) => (await prisma.product.count({ where: { slug: s } })) > 0,
    ));

    return productRepository.create({
      ...input,
      slug,
      category: { connect: { id: input.categoryId } },
      ...(input.collectionId && { collection: { connect: { id: input.collectionId } } }),
    });
  },

  async update(id: string, input: ProductUpdateInput) {
    return productRepository.update(id, {
      ...input,
      ...(input.categoryId && { category: { connect: { id: input.categoryId } } }),
      ...(input.collectionId !== undefined && {
        collection: input.collectionId
          ? { connect: { id: input.collectionId } }
          : { disconnect: true },
      }),
    });
  },

  delete(id: string) {
    return productRepository.delete(id);
  },
};
