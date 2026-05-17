import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
};

export default function KvkkPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl text-ink-900 font-light mb-10">
        Kişisel Verilerin Korunması (KVKK) Aydınlatma Metni
      </h1>
      <div className="space-y-6 font-sans text-sm text-ink-600 leading-relaxed">
        <p>
          Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında
          veri sorumlusu sıfatıyla hazırlanmıştır.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">1. Veri Sorumlusu</h2>
        <p>
          Web sitemiz üzerinden toplanan kişisel veriler, işletmemiz tarafından işlenmektedir.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">2. İşlenen Kişisel Veriler</h2>
        <p>
          İletişim formu aracılığıyla ad, soyad, e-posta adresi ve telefon numarası;
          bülten aboneliğinde e-posta adresi işlenmektedir.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">3. Verilerin İşlenme Amacı</h2>
        <p>
          Kişisel verileriniz; iletişim taleplerinize yanıt verilmesi, kampanya ve duyuruların
          iletilmesi amacıyla işlenmektedir.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">4. Haklarınız</h2>
        <p>
          KVKK’nın 11. maddesi uyarınca; verilerinize erişim, düzeltme, silme ve işlemeye itiraz
          haklarınız mevcuttur. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
        </p>
      </div>
    </div>
  );
}
