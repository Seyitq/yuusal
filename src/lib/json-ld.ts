// Schema.org JSON-LD yardımcı fonksiyonları
// Sunucu tarafında kullanılır, istemciye <script> tag olarak eklenir

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yuusal.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "YUUŞAL";

// ─── Organization ─────────────────────────────────────────────────────────────

export function buildOrganizationLd(opts?: {
  phone?: string;
  email?: string;
  instagram?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/uploads/general/logo.svg`,
    contactPoint: opts?.phone
      ? [{ "@type": "ContactPoint", telephone: opts.phone, contactType: "customer service" }]
      : undefined,
    email: opts?.email || undefined,
    sameAs: opts?.instagram ? [opts.instagram] : undefined,
  };
}

// ─── WebSite (Sitelinks Searchbox için) ─────────────────────────────────────

export function buildWebSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/kategori/esarp?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

export function buildBreadcrumbLd(
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  };
}

// ─── Product ──────────────────────────────────────────────────────────────────

export function buildProductLd(product: {
  name: string;
  slug: string;
  sku: string;
  description?: string | null;
  images: { url: string; alt?: string | null }[];
  category: { name: string; slug: string };
  composition?: string | null;
}) {
  const mainImage = product.images[0];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description ?? undefined,
    url: `${BASE_URL}/urun/${product.slug}`,
    image: mainImage ? `${BASE_URL}${mainImage.url}` : undefined,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: product.category.name,
    ...(product.composition && { material: product.composition }),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: SITE_NAME },
      url: `${BASE_URL}/urun/${product.slug}`,
    },
  };
}

// ─── Blog / Article ───────────────────────────────────────────────────────────

export function buildArticleLd(post: {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | null;
  updatedAt: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ? `${BASE_URL}${post.coverImage}` : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `${BASE_URL}/blog/${post.slug}`,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/uploads/general/logo.svg` },
    },
  };
}
