import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  shortDesc?: string | null;
  images: { url: string; alt?: string | null; isMain: boolean }[];
  category: { name: string; slug: string };
};

export function ProductCard({ product }: { product: Product }) {
  const image = product.images.find((img) => img.isMain) ?? product.images[0];

  return (
    <Link href={`/urun/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-ink-300 text-sm">YUUŞAL</span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs font-sans text-ink-300 uppercase tracking-wider">
          {product.category.name}
        </p>
        <h3 className="font-sans text-sm text-ink-900 font-medium leading-snug group-hover:text-taupe-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs font-sans text-ink-300">{product.sku}</p>
      </div>
    </Link>
  );
}