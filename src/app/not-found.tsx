import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="font-sans text-xs uppercase tracking-widest text-taupe-400 mb-4">404</p>
      <h1 className="font-serif text-4xl md:text-5xl text-ink-900 font-light mb-4">
        Sayfa Bulunamadı
      </h1>
      <p className="font-sans text-sm text-ink-400 max-w-sm mb-10">
        Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
      </p>
      <Link
        href="/"
        className="font-sans text-xs uppercase tracking-widest text-ink-900 border border-ink-900 px-8 py-3 hover:bg-ink-900 hover:text-cream-50 transition-colors"
      >
        Anasayfaya Dön
      </Link>
    </div>
  );
}
