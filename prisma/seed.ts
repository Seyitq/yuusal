import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seed başlıyor...");

  // ============ ADMIN KULLANICI ============
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@yuusal.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      "SEED_ADMIN_PASSWORD ortam değişkeni ayarlanmamış. " +
        "Seed çalıştırmadan önce güvenli bir şifre belirleyin: export SEED_ADMIN_PASSWORD='...'",
    );
  }
  const adminName = process.env.SEED_ADMIN_NAME ?? "Yönetici";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: "ADMIN",
    },
  });
  console.log("Admin oluşturuldu:", admin.email);

  // ============ SİTE AYARLARI ============
  const settings: { key: string; value: string }[] = [
    { key: "whatsapp.number", value: "905000000000" },
    { key: "whatsapp.messageTemplate", value: "Merhaba {productName} ürünü hakkında bilgi almak istiyorum." },
    { key: "whatsapp.generalTemplate", value: "Merhaba YUUŞAL, bilgi almak istiyorum." },
    { key: "contact.email", value: "info@yuusal.com" },
    { key: "contact.phone", value: "+90 500 000 00 00" },
    { key: "contact.address", value: "İstanbul, Türkiye" },
    { key: "social.instagram", value: "https://instagram.com/yuusal" },
    { key: "social.facebook", value: "" },
    { key: "social.tiktok", value: "" },
    { key: "site.name", value: "YUUŞAL" },
    { key: "site.tagline", value: "Zarafetin Yumuşak Hali" },
    { key: "site.logo", value: "/logo.png" },
    { key: "site.favicon", value: "/favicon.ico" },
    { key: "announcementBar.messages", value: JSON.stringify(["14 gün iade ve değişim", "Türkiye geneli kargo", "Doğal ipek koleksiyonu"]) },
    { key: "announcementBar.isActive", value: "true" },
    { key: "seo.defaultTitle", value: "YUUŞAL — Eşarp, Şal, İpek Koleksiyonu" },
    { key: "seo.defaultDescription", value: "YUUŞAL ile zarafetin yumuşak halini keşfedin. Doğal ipek eşarp, şal ve aksesuar koleksiyonları." },
    { key: "seo.googleVerification", value: "" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("Site ayarları oluşturuldu:", settings.length, "kayıt");

  // ============ KATEGORİLER ============
  const salCategory = await prisma.category.upsert({
    where: { slug: "sal" },
    update: {},
    create: {
      slug: "sal",
      name: "Şal",
      description: "Doğal kumaşlardan özenle tasarlanan şal koleksiyonumuz.",
      isActive: true,
      showInMenu: true,
      order: 1,
    },
  });

  const esarpCategory = await prisma.category.upsert({
    where: { slug: "esarp" },
    update: {},
    create: {
      slug: "esarp",
      name: "Eşarp",
      description: "Zarif ve şık eşarp koleksiyonumuz.",
      isActive: true,
      showInMenu: true,
      order: 2,
    },
  });

  const ipekCategory = await prisma.category.upsert({
    where: { slug: "ipek" },
    update: {},
    create: {
      slug: "ipek",
      name: "İpek",
      description: "Saf ipekten özenle üretilen ürünlerimiz.",
      parentId: esarpCategory.id,
      isActive: true,
      showInMenu: true,
      order: 1,
    },
  });

  console.log("Kategoriler oluşturuldu:", salCategory.name, esarpCategory.name, ipekCategory.name);

  // ============ KOLEKSİYONLAR ============
  const baharKoleksiyon = await prisma.collection.upsert({
    where: { slug: "bahar-koleksiyonu-2026" },
    update: {},
    create: {
      slug: "bahar-koleksiyonu-2026",
      name: "Bahar Koleksiyonu 2026",
      description: "Baharın canlı renklerini taşıyan özel koleksiyonumuz.",
      isActive: true,
      isFeatured: true,
    },
  });

  const klasikKoleksiyon = await prisma.collection.upsert({
    where: { slug: "klasik-koleksiyon" },
    update: {},
    create: {
      slug: "klasik-koleksiyon",
      name: "Klasik Koleksiyon",
      description: "Zamansız elegansı yansıtan klasik koleksiyonumuz.",
      isActive: true,
      isFeatured: false,
    },
  });

  console.log("Koleksiyonlar oluşturuldu:", baharKoleksiyon.name, klasikKoleksiyon.name);

  // ============ ÜRÜNLER ============
  const products = [
    {
      sku: "YUUSAL-S001",
      slug: "yuusal-s001-bordo-ipek-sal",
      name: "Bordo İpek Şal",
      shortDesc: "Saf ipekten üretilmiş zarif bordo şal.",
      composition: "%100 İpek",
      careInfo: "Sadece kuru temizleme",
      dimensions: "180x90 cm",
      categoryId: salCategory.id,
      collectionId: baharKoleksiyon.id,
      isActive: true,
      isFeatured: true,
      variants: ["Bordo", "Lacivert"],
    },
    {
      sku: "YUUSAL-S002",
      slug: "yuusal-s002-krem-kasmiri-sal",
      name: "Krem Keşmir Şal",
      shortDesc: "Doğal keşmirden dokunan ince krem şal.",
      composition: "%70 Keşmir, %30 İpek",
      careInfo: "Hafif yıkama programı, 30°C",
      dimensions: "200x70 cm",
      categoryId: salCategory.id,
      collectionId: klasikKoleksiyon.id,
      isActive: true,
      isFeatured: true,
      variants: ["Krem", "Bej"],
    },
    {
      sku: "YUUSAL-E001",
      slug: "yuusal-e001-kirmizi-cicek-esarp",
      name: "Kırmızı Çiçek Eşarp",
      shortDesc: "El boyaması çiçek desenli kırmızı eşarp.",
      composition: "%100 İpek",
      careInfo: "Sadece kuru temizleme",
      dimensions: "85x85 cm",
      categoryId: esarpCategory.id,
      collectionId: baharKoleksiyon.id,
      isActive: true,
      isFeatured: true,
      variants: ["Kırmızı", "Pembe"],
    },
    {
      sku: "YUUSAL-E002",
      slug: "yuusal-e002-siyah-geometrik-esarp",
      name: "Siyah Geometrik Eşarp",
      shortDesc: "Geometrik desenli modern siyah eşarp.",
      composition: "%100 İpek",
      careInfo: "Hafif yıkama, ütüsüz",
      dimensions: "90x90 cm",
      categoryId: esarpCategory.id,
      collectionId: klasikKoleksiyon.id,
      isActive: true,
      isFeatured: false,
      variants: ["Siyah", "Gri"],
    },
    {
      sku: "YUUSAL-I001",
      slug: "yuusal-i001-mavi-ipek-esarp",
      name: "Mavi İpek Eşarp",
      shortDesc: "Saf ipekten üretilmiş açık mavi eşarp.",
      composition: "%100 İpek",
      careInfo: "Sadece kuru temizleme",
      dimensions: "85x85 cm",
      categoryId: ipekCategory.id,
      collectionId: baharKoleksiyon.id,
      isActive: true,
      isFeatured: true,
      variants: ["Açık Mavi", "Kobalt Mavi"],
    },
    {
      sku: "YUUSAL-I002",
      slug: "yuusal-i002-yesil-ipek-sal",
      name: "Yeşil İpek Şal",
      shortDesc: "Doğadan ilham alan yeşil tonlarında ipek şal.",
      composition: "%100 İpek",
      careInfo: "Sadece kuru temizleme",
      dimensions: "170x85 cm",
      categoryId: ipekCategory.id,
      collectionId: klasikKoleksiyon.id,
      isActive: true,
      isFeatured: false,
      variants: ["Haki", "Zeytin Yeşili"],
    },
  ];

  for (const productData of products) {
    const { variants: variantNames, ...productFields } = productData;

    const product = await prisma.product.upsert({
      where: { sku: productFields.sku },
      update: {},
      create: productFields,
    });

    // Varyantlar oluştur
    for (let i = 0; i < variantNames.length; i++) {
      const variantName = variantNames[i];
      const variantSku = `${productFields.sku}-V${i + 1}`;

      await prisma.productVariant.upsert({
        where: { sku: variantSku },
        update: {},
        create: {
          productId: product.id,
          colorName: variantName,
          sku: variantSku,
          order: i,
        },
      });
    }

    console.log("Ürün oluşturuldu:", product.sku, product.name);
  }

  // ============ HERO SLIDES ============
  const heroSlides = [
    {
      title: "Bahar Şıklığı",
      subtitle: "Yeni Koleksiyon 2026",
      ctaText: "Keşfet",
      ctaLink: "/koleksiyon/bahar-koleksiyonu-2026",
      desktopImage: "/uploads/slider/hero-1.webp",
      mobileImage: "/uploads/slider/hero-1-mobile.webp",
      order: 0,
      isActive: true,
    },
    {
      title: "Saf İpek Koleksiyonu",
      subtitle: "Doğanın En Güzel Hediyesi",
      ctaText: "İncele",
      ctaLink: "/kategori/ipek",
      desktopImage: "/uploads/slider/hero-2.webp",
      mobileImage: "/uploads/slider/hero-2-mobile.webp",
      order: 1,
      isActive: true,
    },
    {
      title: "Klasik Zarif",
      subtitle: "Zamansız Şıklık",
      ctaText: "Koleksiyonu Gör",
      ctaLink: "/koleksiyon/klasik-koleksiyon",
      desktopImage: "/uploads/slider/hero-3.webp",
      mobileImage: "/uploads/slider/hero-3-mobile.webp",
      order: 2,
      isActive: true,
    },
  ];

  for (const slideData of heroSlides) {
    // HeroSlide'da benzersiz alan yok, sadece ilk seed'de oluştur
    const existing = await prisma.heroSlide.findFirst({
      where: { title: slideData.title },
    });
    if (!existing) {
      await prisma.heroSlide.create({ data: slideData });
    }
  }
  console.log("Hero slide'lar oluşturuldu:", heroSlides.length, "kayıt");

  console.log("Seed tamamlandı!");
}

main()
  .catch((e) => {
    console.error("Seed hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
