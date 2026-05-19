import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price?: number | null;
  priceOld?: number | null;
  shortDesc?: string | null;
  images: { url: string; alt?: string | null; isMain: boolean }[];
  category: { name: string; slug: string };
};

export function ProductCard({ product }: { product: Product }) {
  const image = product.images.find((img) => img.isMain) ?? product.images[0];

  return (
    <Link href={`/urun/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        {product.price != null && product.priceOld != null && (
          <div className="absolute top-2 left-2 z-10 bg-bronze px-2 py-0.5">
            <span className="font-sans text-xs text-cream-50 font-medium">
              %{Math.round((1 - product.price / product.priceOld) * 100)} İndirim
            </span>
          </div>
        )}
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
        {product.price != null ? (
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-semibold text-ink-900">
              {formatPrice(product.price)}
            </span>
            {product.priceOld != null && (
              <span className="font-sans text-xs text-ink-400 line-through">
                {formatPrice(product.priceOld)}
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs font-sans text-ink-300">{product.sku}</p>
        )}
      </div>
    </Link>
  );
}