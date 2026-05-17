import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İade ve Değişim",
};

export default function IadeDegisimPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl text-ink-900 font-light mb-10">İade ve Değişim</h1>
      <div className="space-y-6 font-sans text-sm text-ink-600 leading-relaxed">
        <p>
          Ürünlerimiz sipariş bazlı üretilmekte ve WhatsApp üzerinden sipariş alınmaktadır.
          İade ve değişim koşulları aşağıda belirtilmiştir.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">İade Koşulları</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Teslim tarihinden itibaren 14 gün içinde iade talep edilmelidir.</li>
          <li>Ürün kullanılmamış, etiketleri üzerinde olmalıdır.</li>
          <li>Özel sipariş ürünlerde iade kabul edilmemektedir.</li>
        </ul>
        <h2 className="font-serif text-xl text-ink-900 mt-8">Değişim Koşulları</h2>
        <p>
          Değişim talepleri için WhatsApp üzerinden bize ulaşın. Stok durumuna göre değişim
          sağlanmaktadır.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">Kargo</h2>
        <p>
          İade kargoları alıcı ödemeli gönderilebilir. Hatalı ürün gönderimlerinde kargo ücretleri
          tarafımızca karşılanır.
        </p>
      </div>
    </div>
  );
}
