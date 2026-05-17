import type { Metadata } from "next";
import { settingService } from "@/server/services/setting.service";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "YUUŞal hakkında bilgi edinin.",
};

export default async function HakkimizdaPage() {
  const [siteName, aboutText] = await Promise.all([
    settingService.get("site.name"),
    settingService.get("about.content"),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-ink-900 font-light mb-10">
        Hakkımızda
      </h1>

      {aboutText ? (
        <div
          className="prose prose-sm max-w-none font-sans text-ink-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: aboutText }}
        />
      ) : (
        <div className="space-y-6 font-sans text-sm text-ink-600 leading-relaxed">
          <p>
            {siteName ?? "YUUŞAL"}, el işçiliği ve zarafeti bir araya getiren özel üretim eşarp,
            şal ve ipek tekstil müceldiğinin markasıdır.
          </p>
          <p>
            Her ürünümüz, yüksek kaliteli doğal malzemelerden, ustalıkla tasarlanmış; geleneksel
            dokuma sanatını çağdaş bir estetikle buluşturuyor.
          </p>
          <p>
            Sınırlı üretim anlayışımızla her koleksiyon; benzersiz ve bilineli bir tercih yapmak
            isteyenlere hitap ediyor.
          </p>
        </div>
      )}
    </div>
  );
}
