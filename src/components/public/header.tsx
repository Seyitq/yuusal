import Link from "next/link";
import Image from "next/image";
import { categoryService } from "@/server/services/category.service";
import { settingService } from "@/server/services/setting.service";
import { MobileMenu } from "./mobile-menu";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export async function Header() {
  const [categories, phone, template] = await Promise.all([
    categoryService.getMenuCategories(),
    settingService.get("contact.phone"),
    settingService.get("whatsapp.messageTemplate"),
  ]);

  const whatsappUrl = phone
    ? buildWhatsAppUrl({ phoneNumber: phone, template: template ?? "Merhaba, bilgi almak istiyorum." })
    : null;

  return (
    <header className="sticky top-0 z-30 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Sol: Hamburger (mobil) */}
          <div className="flex-1 flex items-center md:hidden">
            <MobileMenu categories={categories} />
          </div>

          {/* Logo */}
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <Link href="/" className="block hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="YUUŞAL"
                width={140}
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav — ortada */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
            {categories.map((cat) => (
              <div key={cat.id} className="relative group">
                <Link
                  href={`/kategori/${cat.slug}`}
                  className="text-xs font-sans uppercase tracking-widest text-ink-700 hover:text-ink-900 py-2 transition-colors"
                >
                  {cat.name}
                </Link>
                {cat.children.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 hidden group-hover:block">
                    <div className="bg-cream-50 border border-cream-200 shadow-lg rounded-sm min-w-48 py-3">
                      <Link
                        href={`/kategori/${cat.slug}`}
                        className="block px-5 py-2 text-xs font-sans text-ink-500 hover:text-ink-900 hover:bg-cream-100 uppercase tracking-wider"
                      >
                        Tümü
                      </Link>
                      {cat.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/kategori/${child.slug}`}
                          className="block px-5 py-2 text-xs font-sans text-ink-500 hover:text-ink-900 hover:bg-cream-100 uppercase tracking-wider"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/hakkimizda"
              className="text-xs font-sans uppercase tracking-widest text-ink-700 hover:text-ink-900 py-2 transition-colors"
            >
              Hakkımızda
            </Link>
            <Link
              href="/blog"
              className="text-xs font-sans uppercase tracking-widest text-ink-700 hover:text-ink-900 py-2 transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Sağ: İletişim */}
          <div className="flex-1 flex items-center justify-end gap-4">
            {/* Masaüstü iletişim linki */}
            <Link
              href="/iletisim"
              className="hidden md:flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-ink-700 hover:text-ink-900 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>İletişim</span>
            </Link>
            {/* Mobil WhatsApp hızlı erişim */}
            {phone && whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden flex items-center justify-center w-9 h-9 text-ink-700 hover:text-green-600 transition-colors"
                aria-label="WhatsApp ile iletişim"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}