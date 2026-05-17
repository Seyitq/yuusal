"use client";

import { useState } from "react";
import Image from "next/image";

type ProductImage = {
  id: string;
  url: string;
  alt?: string | null;
  order: number;
  isMain: boolean;
};

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const mainImage = sorted.find((img) => img.isMain) ?? sorted[0];
  const [selected, setSelected] = useState(mainImage?.url ?? "");

  if (!sorted.length) {
    return (
      <div className="aspect-square bg-cream-100 flex items-center justify-center">
        <span className="font-serif text-ink-300">Görsel yok</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Büyük görsel */}
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <Image
          src={selected}
          alt={productName}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnail’lar */}
      {sorted.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {sorted.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelected(img.url)}
              className={`relative aspect-square overflow-hidden bg-cream-100 border-2 transition-colors ${
                selected === img.url ? "border-ink-900" : "border-transparent hover:border-ink-300"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? productName}
                fill
                className="object-cover"
                sizes="10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}