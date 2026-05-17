import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
};

export default function MesafeliSatisPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl text-ink-900 font-light mb-10">
        Mesafeli Satış Sözleşmesi
      </h1>
      <div className="space-y-6 font-sans text-sm text-ink-600 leading-relaxed">
        <p>
          Bu sözleşme, 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
          Yönetmeliği çerçevesinde hazırlanmıştır.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">1. Taraflar</h2>
        <p>
          Satıcı: YUUŞAL / Alıcı: Sipariş veren kişi.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">2. Konu</h2>
        <p>
          Sözleşme konusu ürün, alıcı tarafından WhatsApp üzerinden iletişim kurularak
          kararlaştırılmaktadır.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">3. Ödeme</h2>
        <p>
          Ödeme koşulları sipariş görüşmesi sırasında karşılıklı belirlenir.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">4. Teslimat</h2>
        <p>
          Ürünler sipariş onayından itibaren 3-7 iş günü içinde kargoya verilir.
        </p>
        <h2 className="font-serif text-xl text-ink-900 mt-8">5. Cayma Hakkı</h2>
        <p>
          Tüketici, sözleşmenin kurulduğu tarihten itibaren 14 gün içinde herhangi bir gerekçe
          göstermeksizin cayma hakkını kullanabilir.
        </p>
      </div>
    </div>
  );
}
