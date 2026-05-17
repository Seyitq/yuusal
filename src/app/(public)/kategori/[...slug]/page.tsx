import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categoryService } from "@/server/services/category.service";
import { productService } from "@/server/services/product.service";
import { collectionService } from "@/server/services/collection.service";
import { ProductGrid } from "@/components/public/product-grid";
import { FilterSidebar } from "@/components/public/filter-sidebar";
import Link from "next/link";
import { Suspense } from "react";

export const revalidate = 120;

const PER_PAGE = 24;

interface Props {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ sayfa?: string; siralama?: string; koleksiyon?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categorySlug = slug[slug.length - 1];
  const category = await categoryService.getBySlug(categorySlug);
  if (!category) return {};
  return {
    title: category.metaTitle ?? category.name,
    description: category.metaDescription ?? category.description ?? undefined,
  };
}

export default async function KategoriPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const fullSlug = slug.join("/");
  const categorySlug = slug[slug.length - 1];

  const [category, collections] = await Promise.all([
    categoryService.getBySlug(categorySlug),
    collectionService.getAllActive(),
  ]);

  if (!category || !category.isActive) notFound();

  const page = Math.max(1, parseInt(sp.sayfa ?? "1", 10));
  const sort = (sp.siralama ?? "newest") as "newest" | "oldest" | "az" | "za";
  const collectionSlug = sp.koleksiyon ?? undefined;

  const { products, total } = await productService.listForCategory({
    categorySlug,
    page,
    perPage: PER_PAGE,
    sort,
    collectionSlug,
  });

  const totalPages = Math.ceil(total / PER_PAGE);

  const breadcrumbs = [
    { name: "Anasayfa", href: "/" },
    ...(category.parent
      ? [{ name: category.parent.name, href: `/kategori/${category.parent.slug}` }]
      : []),
    { name: category.name, href: `/kategori/${fullSlug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-sans text-ink-400 mb-6">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-ink-700">{crumb.name}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-ink-900 transition-colors">
                {crumb.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-ink-900 mb-2">{category.name}</h1>
        <p className="text-sm font-sans text-ink-400">{total} ürün bulunmaktadır</p>
      </div>

      {/* Alt kategoriler */}
      {category.children && category.children.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/kategori/${child.slug}`}
              className="font-sans text-xs uppercase tracking-wider text-ink-500 border border-ink-200 px-4 py-2 hover:border-ink-700 hover:text-ink-900 transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <Suspense>
          <FilterSidebar collections={collections} />
        </Suspense>

        <div className="flex-1">
          <ProductGrid products={products} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {page > 1 && (
                <PaginationLink
                  href={buildPageUrl(fullSlug, { ...sp, sayfa: String(page - 1) })}
                  label="← Önceki"
                />
              )}
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                <PaginationLink
                  key={p}
                  href={buildPageUrl(fullSlug, { ...sp, sayfa: String(p) })}
                  label={String(p)}
                  active={p === page}
                />
              ))}
              {page < totalPages && (
                <PaginationLink
                  href={buildPageUrl(fullSlug, { ...sp, sayfa: String(page + 1) })}
                  label="Sonraki →"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function buildPageUrl(slug: string, sp: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return `/kategori/${slug}${qs ? `?${qs}` : ""}`;
}

function PaginationLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`font-sans text-xs px-3 py-2 border transition-colors ${
        active
          ? "bg-ink-900 text-cream-50 border-ink-900"
          : "text-ink-500 border-ink-200 hover:border-ink-700 hover:text-ink-900"
      }`}
    >
      {label}
    </Link>
  );
}