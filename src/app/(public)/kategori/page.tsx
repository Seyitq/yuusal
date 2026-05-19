import { categoryService } from "@/server/services/category.service";
import { productService } from "@/server/services/product.service";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Kategoriler | YUUŞAL",
  description: "YUUŞAL koleksiyon kategorilerini keşfedin. Eşarp, şal, ipek ve daha fazlası.",
};

export default async function KategoriPage() {
  const [allCategories, newestProducts] = await Promise.all([
    categoryService.getAll(),
    productService.listNewest(8),
  ]);

  // Sadece kök kategorileri (parent olmayan) ve aktif olanlar
  const rootCategories = allCategories.filter(
    (c: { isActive: boolean; parent: unknown }) => c.isActive && c.parent === null
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Başlık */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl md:text-4xl text-ink-900">Kategoriler</h1>
        <p className="font-sans text-sm text-ink-500 mt-3">
          İlham veren koleksiyonlarımızı keşfedin
        </p>
      </div>

      {rootCategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {rootCategories.map((cat: {
            id: string;
            slug: string;
            name: string;
            imageUrl: string | null;
            children: { id: string; slug: string; name: string }[];
          }) => (
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
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-cream-200 to-taupe-400/30" />
              )}
              <div className="absolute inset-0 flex flex-col items-end justify-end p-4 bg-gradient-to-t from-ink-900/60">
                <span className="font-sans text-xs uppercase tracking-widest text-cream-50 font-medium">
                  {cat.name}
                </span>
                {cat.children.length > 0 && (
                  <span className="font-sans text-xs text-cream-200/70 mt-0.5">
                    {cat.children.length} alt kategori
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-ink-400">
          <p className="font-sans text-sm">Henüz kategori eklenmemiş.</p>
        </div>
      )}

      {/* Yeni Gelenler */}
      {newestProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl text-ink-900 mb-8">Yeni Gelenler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newestProducts.slice(0, 4).map((product: {
              id: string;
              slug: string;
              name: string;
              images: { url: string; alt: string | null }[];
            }) => (
              <Link
                key={product.id}
                href={`/urun/${product.slug}`}
                className="group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-cream-100 mb-3">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}                      width={400}
                      height={533}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-cream-200" />
                  )}
                </div>
                <p className="font-sans text-sm text-ink-700">{product.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
