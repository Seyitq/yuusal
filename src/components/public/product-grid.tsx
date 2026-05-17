import { ProductCard } from "./product-card";

type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  shortDesc?: string | null;
  images: { url: string; alt?: string | null; isMain: boolean }[];
  category: { name: string; slug: string };
};

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="text-center py-16">
        <p className="font-sans text-ink-300">Aradığınız kriterde ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}