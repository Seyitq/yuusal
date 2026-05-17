import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { categoryService } from "@/server/services/category.service";
import { CategoryForm } from "@/components/admin/category-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Yeni Kategori" };

export default async function YeniKategoriPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const categories = await categoryService.getAll();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/kategoriler" className="inline-flex items-center text-sm text-ink-500 hover:text-bronze mb-3">
          <ChevronLeft className="h-4 w-4" />
          Kategorilere dön
        </Link>
        <h1 className="text-2xl font-bold text-ink-900">Yeni Kategori</h1>
      </div>

      <CategoryForm
        parentCategories={categories.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
