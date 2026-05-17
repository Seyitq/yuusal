import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { collectionService } from "@/server/services/collection.service";
import { productService } from "@/server/services/product.service";
import { ProductGrid } from "@/components/public/product-grid";
import { FilterSidebar } from "@/components/public/filter-sidebar";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const revalidate = 120;

const PER_PAGE = 24;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sayfa?: string; siralama?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await collectionService.getBySlug(slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description ?? undefined,
  };
}

export default async function KoleksiyonPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const collection = await collectionService.getBySlug(slug);
  if (!collection || !collection.isActive) notFound();

  const page = Math.max(1, parseInt(sp.sayfa ?? "1", 10));
  const sort = (sp.siralama ?? "newest") as "newest" | "oldest" | "az" | "za";

  const { products, total } = await productService.listForCollection({
    collectionId: collection.id,
    page,
    perPage: PER_PAGE,
    sort,
  });

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative aspect-[21/7] overflow-hidden bg-cream-200">
        {collection.coverImage && (
          <Image
            src={collection.coverImage}
            alt={collection.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-ink-900/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-4xl md:text-5xl text-cream-50 font-light mb-4">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="font-sans text-sm text-cream-100 max-w-xl">{collection.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-sans text-ink-400 mb-8">
          <Link href="/" className="hover:text-ink-900 transition-colors">Anasayfa</Link>
          <span>/</span>
          <span className="text-ink-700">{collection.name}</span>
        </nav>

        <p className="text-sm font-sans text-ink-400 mb-8">{total} ürün bulunmaktadır</p>

        <div className="flex flex-col md:flex-row gap-8">
          <Suspense>
            <FilterSidebar collections={[]} />
          </Suspense>

          <div className="flex-1">
            <ProductGrid products={products} />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {page > 1 && (
                  <PageLink
                    href={buildUrl(slug, { ...sp, sayfa: String(page - 1) })}
                    label="← Önceki"
                  />
                )}
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                  <PageLink
                    key={p}
                    href={buildUrl(slug, { ...sp, sayfa: String(p) })}
                    label={String(p)}
                    active={p === page}
                  />
                ))}
                {page < totalPages && (
                  <PageLink
                    href={buildUrl(slug, { ...sp, sayfa: String(page + 1) })}
                    label="Sonraki →"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function buildUrl(slug: string, sp: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return `/koleksiyon/${slug}${qs ? `?${qs}` : ""}`;
}

function PageLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={`font-sans text-xs px-3 py-2 border transition-colors ${
        active
          ? "bg-ink-900 text-cream-50 border-ink-900"
          : "text-ink-500 border-ink-200 hover:border-ink-700 hover:text-ink-900"
      }`}
    >
      {label}
    </a>
  );
}