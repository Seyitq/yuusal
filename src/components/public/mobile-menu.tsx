"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Menu, ChevronDown } from "lucide-react";

type Category = {
  id: string;
  slug: string;
  name: string;
  children: { id: string; slug: string; name: string }[];
};

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      {/* Hamburger butonu */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-ink-900"
        aria-label="Menüyü aç"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-ink-900/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-cream-50 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
          <span className="font-serif text-xl tracking-widest text-ink-900">YUUŞAL</span>
          <button onClick={() => setOpen(false)} className="p-1 text-ink-500" aria-label="Menüyü kapat">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-4 py-6">
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                {cat.children.length > 0 ? (
                  <>
                    <button
                      onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                      className="flex items-center justify-between w-full px-3 py-3 text-sm font-sans text-ink-700 uppercase tracking-wider hover:text-ink-900"
                    >
                      {cat.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expanded === cat.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expanded === cat.id && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-cream-200 pl-4">
                        <li>
                          <Link
                            href={`/kategori/${cat.slug}`}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-sm font-sans text-ink-500 hover:text-ink-900"
                          >
                            Tümü
                          </Link>
                        </li>
                        {cat.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/kategori/${child.slug}`}
                              onClick={() => setOpen(false)}
                              className="block py-2 text-sm font-sans text-ink-500 hover:text-ink-900"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={`/kategori/${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-3 text-sm font-sans text-ink-700 uppercase tracking-wider hover:text-ink-900"
                  >
                    {cat.name}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                href="/hakkimizda"
                onClick={() => setOpen(false)}
                className="block px-3 py-3 text-sm font-sans text-ink-700 uppercase tracking-wider hover:text-ink-900"
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link
                href="/iletisim"
                onClick={() => setOpen(false)}
                className="block px-3 py-3 text-sm font-sans text-ink-700 uppercase tracking-wider hover:text-ink-900"
              >
                İletişim
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                onClick={() => setOpen(false)}
                className="block px-3 py-3 text-sm font-sans text-ink-700 uppercase tracking-wider hover:text-ink-900"
              >
                Blog
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
