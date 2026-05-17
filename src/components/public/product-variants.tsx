"use client";

import { useState } from "react";

type Variant = {
  id: string;
  colorName: string;
  colorHex?: string | null;
  pattern?: string | null;
  isActive: boolean;
  images: { url: string; alt?: string | null; isMain: boolean }[];
};

export function ProductVariants({ variants }: { variants: Variant[] }) {
  const active = variants.filter((v) => v.isActive);
  const [selectedId, setSelectedId] = useState(active[0]?.id ?? null);

  if (!active.length) return null;

  return (
    <div>
      <p className="font-sans text-xs uppercase tracking-widest text-ink-500 mb-3">
        Renk:{" "}
        <span className="text-ink-900 font-medium">
          {active.find((v) => v.id === selectedId)?.colorName}
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {active.map((variant) => (
          <button
            key={variant.id}
            onClick={() => setSelectedId(variant.id)}
            title={variant.colorName}
            className={`relative h-9 w-9 rounded-full border-2 transition-all ${
              selectedId === variant.id
                ? "border-ink-900 scale-110"
                : "border-cream-200 hover:border-ink-400"
            }`}
          >
            {variant.colorHex ? (
              <span
                className="absolute inset-1 rounded-full"
                style={{ backgroundColor: variant.colorHex }}
              />
            ) : (
              <span className="absolute inset-1 rounded-full bg-cream-200 flex items-center justify-center">
                <span className="text-[8px] font-sans text-ink-500 leading-none">
                  {variant.colorName.substring(0, 2).toUpperCase()}
                </span>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}