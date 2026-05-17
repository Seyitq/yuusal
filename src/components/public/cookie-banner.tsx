"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink-900 text-cream-200 px-4 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs font-sans leading-relaxed text-ink-300 flex-1">
          Bu site, size daha iyi bir deneyim sunmak için çerezler kullanmaktadır.{" "}
          <Link href="/cerez-politikasi" className="underline hover:text-cream-100">
            Çerez Politikası
          </Link>{" "}
          hakkında daha fazla bilgi alabilirsiniz.
        </p>
        <button
          onClick={accept}
          className="flex-shrink-0 bg-cream-100 text-ink-900 font-sans text-xs uppercase tracking-widest px-6 py-2.5 hover:bg-cream-200 transition-colors"
        >
          Kabul Et
        </button>
      </div>
    </div>
  );
}