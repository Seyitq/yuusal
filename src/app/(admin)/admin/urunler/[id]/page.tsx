import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { categoryService } from "@/server/services/category.service";
import { collectionService } from "@/server/services/collection.service";
import { productService } from "@/server/services/product.service";
import { ProductForm } from "@/components/admin/product-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Ürün Düzenle" };

export default async function UrunDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const { id } = await params;

  const [product, categories, collections] = await Promise.all([
    productService.getById(id),
    categoryService.getAll(),
    collectionService.getAllActive(),
  ]);

  if (!product) notFound();

  const initialImages = product.images.map((img: { url: string; alt: string | null }) => ({
    url: img.url,
    alt: img.alt ?? "",
  }));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/urunler" className="inline-flex items-center text-sm text-ink-500 hover:text-bronze mb-3">
          <ChevronLeft className="h-4 w-4" />
          Ürünlere dön
        </Link>
        <h1 className="text-2xl font-bold text-ink-900">Ürün Düzenle</h1>
        <p className="text-sm text-ink-500 mt-1">{product.name}</p>
      </div>

      <ProductForm
        productId={id}
        defaultValues={{
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          shortDesc: product.shortDesc ?? "",
          description: product.description ?? "",
          categoryId: product.categoryId,
          collectionId: product.collectionId ?? "",
          composition: product.composition ?? "",
          careInfo: product.careInfo ?? "",
          dimensions: product.dimensions ?? "",
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          metaTitle: product.metaTitle ?? "",
          metaDescription: product.metaDescription ?? "",
          order: product.order,
          // Kuru\u015f \u2192 T\u20ba \u00e7evirimi (form T\u20ba g\u00f6steriyor)
          price: product.price != null ? product.price / 100 : undefined,
          priceOld: product.priceOld != null ? product.priceOld / 100 : undefined,
        }}
        images={initialImages}
        categories={categories.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
        collections={collections.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
