import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çerez Politikası",
};

export default function CerezPolitikasiPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl text-ink-900 font-light mb-10">Çerez Politikası</h1>
      <div className="space-y-6 font-sans text-sm text-ink-600 leading-relaxed">
        <p>
          Web sitemiz, deneyiminizi iyileştirmek amacıyla çerez kullanmaktadır.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">Zorunlu Çerezler</h2>
        <p>
          Sitenin temel işlevselliği için gerekli olan çerezlerdir. Bu çerezler devre dışı
          bırakılamaz.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">Analitik Çerezler</h2>
        <p>
          Site kullanımını anlamamazı sağlayan anonim istatistik çerezleridir. Kabul butonu
          ile onay vermeniz halinde aktif olur.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">Çerez Yönetimi</h2>
        <p>
          Tarayıcı ayarlarınızdan çerezleri istediginiz zaman silebilirsiniz.
        </p>
      </div>
    </div>
  );
}
