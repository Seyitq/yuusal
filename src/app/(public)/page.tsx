import { slideService } from "@/server/services/slide.service";
import { productService } from "@/server/services/product.service";
import { categoryService } from "@/server/services/category.service";
import { collectionService } from "@/server/services/collection.service";
import { blogService } from "@/server/services/blog.service";
import { settingService } from "@/server/services/setting.service";
import { HeroSlider } from "@/components/public/hero-slider";
import { ProductGrid } from "@/components/public/product-grid";
import { NewsletterForm } from "@/components/public/newsletter-form";
import { buildOrganizationLd, buildWebSiteLd } from "@/lib/json-ld";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [title, description] = await Promise.all([
    settingService.get("seo.defaultTitle"),
    settingService.get("seo.defaultDescription"),
  ]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yuusal.com";

  return {
    title: title || "YUUŞAL — Eşarp, Şal, İpek Koleksiyonu",
    description: description || "YUUŞAL ile zarafetin yumuşak halini keşfedin.",
    openGraph: {
      title: title || "YUUŞAL — Eşarp, Şal, İpek Koleksiyonu",
      description: description || "YUUŞAL ile zarafetin yumuşak halini keşfedin.",
      url: siteUrl,
      siteName: "YUUŞAL",
      type: "website",
    },
    alternates: { canonical: siteUrl },
  };
}

export default async function HomePage() {
  const [slides, featuredProducts, newestProducts, categories, featuredCollection, latestPosts, settings] =
    await Promise.all([
      slideService.getActiveSlides(),
      productService.listFeatured(8),
      productService.listNewest(8),
      categoryService.getMenuCategories(),
      collectionService.getFeatured().then((cols) => cols[0] ?? null),
      blogService.getPublished({ take: 3 }),
      settingService.getMany(["contact.phone", "contact.email", "social.instagram"]),
    ]);

  const orgLd = buildOrganizationLd({
    phone: settings["contact.phone"],
    email: settings["contact.email"],
    instagram: settings["social.instagram"],
  });
  const websiteLd = buildWebSiteLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      {/* Hero Slider */}
      <HeroSlider slides={slides} />

      {/* Öne Çıkan Kategoriler */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-serif text-2xl md:text-3xl text-ink-900 text-center mb-10">
            Koleksiyonları Keşfet
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="group relative aspect-square overflow-hidden bg-cream-100"
              >
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-ink-900/60">
                  </div>
                )}
                <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-ink-900/50">
                  <span className="font-sans text-xs uppercase tracking-widest text-cream-50 font-medium">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Öne Çıkan Ürünler */}
      {featuredProducts.length > 0 && (
        <section className="bg-cream-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-2xl md:text-3xl text-ink-900">
                Öne Çıkanlar
              </h2>
              <Link
                href="/kategori"
                className="font-sans text-xs uppercase tracking-widest text-taupe-500 hover:text-ink-900 transition-colors"
              >
                Tümünü Gör →
              </Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      {/* Koleksiyon Banner */}
      {featuredCollection && (
        <section className="relative overflow-hidden">
        <div className="relative aspect-[4/3] sm:aspect-[2/1] md:aspect-[4/1] bg-cream-200">
            {featuredCollection.coverImage && (
              <Image
                src={featuredCollection.coverImage}
                alt={featuredCollection.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-ink-900/40 flex flex-col items-center justify-center text-center gap-4">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-cream-200">
                Yeni Koleksiyon
              </p>
              <h3 className="font-serif text-3xl md:text-5xl text-cream-50 font-light">
                {featuredCollection.name}
              </h3>
              <Link
                href={`/koleksiyon/${featuredCollection.slug}`}
                className="font-sans text-xs uppercase tracking-[0.2em] text-cream-50 border border-cream-50/60 hover:bg-cream-50 hover:text-ink-900 px-8 py-3 transition-colors mt-2"
              >
                Koleksiyonu Keşfet
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Yeni Gelenler */}
      {newestProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-2xl md:text-3xl text-ink-900">
              Yeni Gelenler
            </h2>
          </div>
          <ProductGrid products={newestProducts} />
        </section>
      )}

      {/* Blog Önerileri */}
      {latestPosts.length > 0 && (
        <section className="bg-cream-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-2xl md:text-3xl text-ink-900">
                Blog
              </h2>
              <Link
                href="/blog"
                className="font-sans text-xs uppercase tracking-widest text-taupe-500 hover:text-ink-900 transition-colors"
              >
                Tüm Yazılar →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  {post.coverImage && (
                    <div className="relative aspect-video overflow-hidden bg-cream-200 mb-4">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <h3 className="font-serif text-lg text-ink-900 group-hover:text-taupe-500 transition-colors mb-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm font-sans text-ink-500 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-ink-900 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-cream-100 mb-3">
            Bültene Abone Olun
          </h2>
          <p className="font-sans text-sm text-ink-300 mb-8">
            Yeni koleksiyonlar ve özel tekliflerden ilk siz haberdar olun.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
