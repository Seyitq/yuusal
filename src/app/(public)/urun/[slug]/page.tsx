import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productService } from "@/server/services/product.service";
import { ProductGallery } from "@/components/public/product-gallery";
import { ProductVariants } from "@/components/public/product-variants";
import { WhatsAppCTA } from "@/components/public/whatsapp-cta";
import { ProductGrid } from "@/components/public/product-grid";
import { buildProductLd, buildBreadcrumbLd } from "@/lib/json-ld";
import Link from "next/link";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yuusal.com";
  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDesc ?? undefined,
    openGraph: {
      title: product.metaTitle ?? product.name,
      description: product.metaDescription ?? product.shortDesc ?? undefined,
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
      type: "website",
    },
    alternates: { canonical: `${siteUrl}/urun/${slug}` },
  };
}

export default async function UrunPage({ params }: Props) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);

  if (!product) notFound();

  // Benzer ürünler (aynı kategoriden)
  const similar = await productService
    .listForCategory({ categorySlug: product.category.slug, page: 1, perPage: 5, sort: "newest" })
    .then(({ products }) => products.filter((p) => p.id !== product.id).slice(0, 4));

  const productLd = buildProductLd({
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    images: product.images,
    category: product.category,
    composition: product.composition,
  });

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Anasayfa", href: "/" },
    { name: product.category.name, href: `/kategori/${product.category.slug}` },
    { name: product.name, href: `/urun/${product.slug}` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-sans text-ink-400 mb-8">
        <Link href="/" className="hover:text-ink-900 transition-colors">Anasayfa</Link>
        <span>/</span>
        <Link
          href={`/kategori/${product.category.slug}`}
          className="hover:text-ink-900 transition-colors"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-ink-700">{product.name}</span>
      </nav>

      {/* Ürün Ana İçerik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Sol: Galeri */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Sağ: Bilgiler */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-taupe-400 mb-2">
              {product.category.name}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-ink-900 font-light leading-tight mb-2">
              {product.name}
            </h1>
            <p className="font-sans text-xs text-ink-300 tracking-wider">
              Ürün Kodu: {product.sku}
            </p>
          </div>

          {product.shortDesc && (
            <p className="font-sans text-sm text-ink-600 leading-relaxed">{product.shortDesc}</p>
          )}

          {/* Varyantlar */}
          {product.variants.length > 0 && (
            <ProductVariants variants={product.variants} />
          )}

          {/* WhatsApp CTA — Tek ana aksiyon */}
          <div className="mt-2">
            <WhatsAppCTA product={{ sku: product.sku, name: product.name }} />
            <p className="text-xs font-sans text-ink-400 text-center mt-3">
              Stok durumu, kargo ve sipariş için WhatsApp üzerinden iletişime geçebilirsiniz.
            </p>
          </div>

          {/* Ürün Özellikleri */}
          {(product.composition || product.careInfo || product.dimensions) && (
            <div className="border-t border-cream-200 pt-6 space-y-3">
              <h3 className="font-sans text-xs uppercase tracking-widest text-ink-500 mb-4">
                Ürün Özellikleri
              </h3>
              {product.composition && (
                <div className="flex gap-4 text-sm font-sans">
                  <span className="text-ink-400 w-24 flex-shrink-0">Materyal</span>
                  <span className="text-ink-700">{product.composition}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex gap-4 text-sm font-sans">
                  <span className="text-ink-400 w-24 flex-shrink-0">Boyut</span>
                  <span className="text-ink-700">{product.dimensions}</span>
                </div>
              )}
              {product.careInfo && (
                <div className="flex gap-4 text-sm font-sans">
                  <span className="text-ink-400 w-24 flex-shrink-0">Bakım</span>
                  <span className="text-ink-700">{product.careInfo}</span>
                </div>
              )}
            </div>
          )}

          {/* Etiketler */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="font-sans text-xs text-ink-400 border border-ink-200 px-3 py-1"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Uzun Açıklama */}
      {product.description && (
        <div className="mt-16 border-t border-cream-200 pt-12">
          <h2 className="font-serif text-2xl text-ink-900 mb-6">Ürün Hakkında</h2>
          <div
            className="prose prose-sm max-w-none font-sans text-ink-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {/* Benzer Ürünler */}
      {similar.length > 0 && (
        <div className="mt-16 border-t border-cream-200 pt-12">
          <h2 className="font-serif text-2xl text-ink-900 mb-8">Benzer Ürünler</h2>
          <ProductGrid products={similar} />
        </div>
      )}
    </div>
  );
}