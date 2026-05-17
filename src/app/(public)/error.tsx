"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="font-sans text-xs uppercase tracking-widest text-taupe-400 mb-4">Hata</p>
      <h1 className="font-serif text-4xl text-ink-900 font-light mb-4">Bir Şeyler Ters Gitti</h1>
      <p className="font-sans text-sm text-ink-400 max-w-sm mb-10">
        Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="font-sans text-xs uppercase tracking-widest text-ink-900 border border-ink-900 px-8 py-3 hover:bg-ink-900 hover:text-cream-50 transition-colors"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="font-sans text-xs uppercase tracking-widest text-ink-500 border border-ink-300 px-8 py-3 hover:border-ink-900 hover:text-ink-900 transition-colors"
        >
          Anasayfa
        </Link>
      </div>
    </div>
  );
}
