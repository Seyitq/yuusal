import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { categoryService } from "@/server/services/category.service";
import { collectionService } from "@/server/services/collection.service";
import { ProductForm } from "@/components/admin/product-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Yeni Ürün" };

export default async function YeniUrunPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const [categories, collections] = await Promise.all([
    categoryService.getAll(),
    collectionService.getAllActive(),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/urunler" className="inline-flex items-center text-sm text-ink-500 hover:text-bronze mb-3">
          <ChevronLeft className="h-4 w-4" />
          Ürünlere dön
        </Link>
        <h1 className="text-2xl font-bold text-ink-900">Yeni Ürün Ekle</h1>
      </div>

      <ProductForm
        categories={categories.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
        collections={collections.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
