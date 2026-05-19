"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

type Collection = { id: string; slug: string; name: string };

const SORT_OPTIONS = [
  { value: "newest", label: "Yeniden Eskiye" },
  { value: "oldest", label: "Eskiden Yeniye" },
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
];

interface Props {
  collections: Collection[];
}

export function FilterSidebar({ collections }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentSort = searchParams.get("siralama") ?? "newest";
  const currentCollection = searchParams.get("koleksiyon") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("sayfa"); // Filtre değişince ilk sayfaya dön
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const filterContent = (
    <>
      {/* Sıralama */}
      <div className="mb-6">
        <h3 className="font-sans text-xs uppercase tracking-widest text-ink-500 mb-3">Sıralama</h3>
        <ul className="space-y-2">
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => updateParam("siralama", opt.value)}
                className={`text-sm font-sans transition-colors ${
                  currentSort === opt.value
                    ? "text-ink-900 font-medium"
                    : "text-ink-400 hover:text-ink-900"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Koleksiyon Filtresi */}
      {collections.length > 0 && (
        <div className="mb-6">
          <h3 className="font-sans text-xs uppercase tracking-widest text-ink-500 mb-3">
            Koleksiyon
          </h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => updateParam("koleksiyon", "")}
                className={`text-sm font-sans transition-colors ${
                  !currentCollection ? "text-ink-900 font-medium" : "text-ink-400 hover:text-ink-900"
                }`}
              >
                Tümü
              </button>
            </li>
            {collections.map((col) => (
              <li key={col.id}>
                <button
                  onClick={() => updateParam("koleksiyon", col.slug)}
                  className={`text-sm font-sans transition-colors ${
                    currentCollection === col.slug
                      ? "text-ink-900 font-medium"
                      : "text-ink-400 hover:text-ink-900"
                  }`}
                >
                  {col.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      {/* Mobil toggle */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="md:hidden flex items-center justify-between w-full border border-cream-200 px-4 py-3 mb-4"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-ink-500" />
          <span className="font-sans text-xs uppercase tracking-widest text-ink-700">Filtrele / Sırala</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-ink-500 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Masaüstü başlık */}
      <div className="hidden md:flex items-center gap-2 mb-6">
        <SlidersHorizontal className="h-4 w-4 text-ink-500" />
        <span className="font-sans text-xs uppercase tracking-widest text-ink-700">Filtrele</span>
      </div>

      {/* İçerik — mobilde toggle ile göster/gizle */}
      <div className={`${mobileOpen ? "block" : "hidden"} md:block`}>
        {filterContent}
      </div>
    </aside>
  );
}