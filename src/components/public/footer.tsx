import Link from "next/link";
import { settingService } from "@/server/services/setting.service";
import { categoryService } from "@/server/services/category.service";

const InstagramIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export async function Footer() {
  const [siteName, instagram, phone, email, address] = await Promise.all([
    settingService.get("site.name"),
    settingService.get("social.instagram"),
    settingService.get("contact.phone"),
    settingService.get("contact.email"),
    settingService.get("contact.address"),
  ]);

  const categories = await categoryService.getMenuCategories();

  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-cream-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Marka */}
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-2xl tracking-[0.15em] text-cream-100 font-medium">
              {siteName || "YUUŞAL"}
            </Link>
            <p className="mt-4 text-sm font-sans text-ink-300 leading-relaxed">
              Zarafetin Yumuşak Hali
            </p>
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-ink-300 hover:text-cream-100 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
                <span className="text-xs font-sans uppercase tracking-widest">Instagram</span>
              </a>
            )}
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="text-xs font-sans uppercase tracking-widest text-cream-200 mb-6">
              Koleksiyonlar
            </h3>
            <ul className="space-y-3">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="text-sm font-sans text-ink-300 hover:text-cream-100 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-xs font-sans uppercase tracking-widest text-cream-200 mb-6">
              Kurumsal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/hakkimizda" className="text-sm font-sans text-ink-300 hover:text-cream-100 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm font-sans text-ink-300 hover:text-cream-100 transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm font-sans text-ink-300 hover:text-cream-100 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="text-sm font-sans text-ink-300 hover:text-cream-100 transition-colors">
                  KVKK Aydınlatma Metni
                </Link>
              </li>
              <li>
                <Link href="/cerez-politikasi" className="text-sm font-sans text-ink-300 hover:text-cream-100 transition-colors">
                  Çerez Politikası
                </Link>
              </li>
              <li>
                <Link href="/iade-degisim" className="text-sm font-sans text-ink-300 hover:text-cream-100 transition-colors">
                  İade &amp; Değişim
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-xs font-sans uppercase tracking-widest text-cream-200 mb-6">
              İletişim
            </h3>
            <ul className="space-y-3 text-sm font-sans text-ink-300">
              {email && <li>{email}</li>}
              {phone && <li>{phone}</li>}
              {address && (
                <li className="leading-relaxed whitespace-pre-line">{address}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ink-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-ink-500">
            © {year} {siteName || "YUUŞAL"}. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6">
            <Link href="/mesafeli-satis" className="text-xs font-sans text-ink-500 hover:text-ink-300 transition-colors">
              Mesafeli Satış Sözleşmesi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}