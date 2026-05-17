import { MetadataRoute } from "next";
import { productService } from "@/server/services/product.service";
import { categoryService } from "@/server/services/category.service";
import { collectionService } from "@/server/services/collection.service";
import { blogService } from "@/server/services/blog.service";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yuusal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // DB yoksa (build ortamı) sadece statik sayfaları döndür
  let products: Awaited<ReturnType<typeof productService.listAll>>["products"] = [];
  let categories: Awaited<ReturnType<typeof categoryService.getAll>> = [];
  let collections: Awaited<ReturnType<typeof collectionService.getAllActive>> = [];
  let blogPosts: Awaited<ReturnType<typeof blogService.getPublished>> = [];

  try {
    [{ products }, categories, collections, blogPosts] = await Promise.all([
      productService.listAll({ isActive: true }),
      categoryService.getAll(),
      collectionService.getAllActive(),
      blogService.getPublished({ take: 1000 }),
    ]);
  } catch {
    // Build zamanında DB yoksa statik sayfalarla devam et
  }

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/kvkk`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cerez-politikasi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/iade-degisim`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/mesafeli-satis`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Aktif ürünler
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/urun/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Aktif kategoriler
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => c.isActive)
    .map((c) => ({
      url: `${BASE_URL}/kategori/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  // Aktif koleksiyonlar
  const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${BASE_URL}/koleksiyon/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Yayında blog yazıları
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...collectionPages, ...blogPages];
}
