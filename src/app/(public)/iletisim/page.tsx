import type { Metadata } from "next";
import { settingService } from "@/server/services/setting.service";
import { ContactForm } from "@/components/public/contact-form";
import { Phone, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Bizimle iletişime geçin.",
};

export default async function IletisimPage() {
  const [phone, email, address, instagramHandle] = await Promise.all([
    settingService.get("contact.phone"),
    settingService.get("contact.email"),
    settingService.get("contact.address"),
    settingService.get("social.instagram"),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-ink-900 font-light mb-12">İletişim</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Sol: Bilgiler */}
        <div className="space-y-8">
          <p className="font-sans text-sm text-ink-600 leading-relaxed">
            Sipariş, stok durumu veya herhangi bir konu için bizimle iletişime geçebilirsiniz.
          </p>

          <div className="space-y-4">
            {phone && (
              <div className="flex items-start gap-4">
                <Phone className="h-4 w-4 text-taupe-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">Telefon</p>
                  <a href={`tel:${phone}`} className="font-sans text-sm text-ink-700 hover:text-ink-900">
                    {phone}
                  </a>
                </div>
              </div>
            )}
            {email && (
              <div className="flex items-start gap-4">
                <Mail className="h-4 w-4 text-taupe-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">E-posta</p>
                  <a href={`mailto:${email}`} className="font-sans text-sm text-ink-700 hover:text-ink-900">
                    {email}
                  </a>
                </div>
              </div>
            )}
            {address && (
              <div className="flex items-start gap-4">
                <MapPin className="h-4 w-4 text-taupe-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">Adres</p>
                  <p className="font-sans text-sm text-ink-700">{address}</p>
                </div>
              </div>
            )}
            {instagramHandle && (
              <div className="flex items-start gap-4">
                <svg className="h-4 w-4 text-taupe-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-1">Instagram</p>
                  <a
                    href={`https://instagram.com/${instagramHandle.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-ink-700 hover:text-ink-900"
                  >
                    @{instagramHandle.replace("@", "")}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sağ: Form */}
        <ContactForm />
      </div>
    </div>
  );
}
