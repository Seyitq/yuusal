import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { categoryService } from "@/server/services/category.service";
import { CategoryForm } from "@/components/admin/category-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kategori Düzenle" };

export default async function KategoriDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const { id } = await params;
  const [category, allCategories] = await Promise.all([
    categoryService.getById(id),
    categoryService.getAll(),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/kategoriler" className="inline-flex items-center text-sm text-ink-500 hover:text-bronze mb-3">
          <ChevronLeft className="h-4 w-4" />
          Kategorilere dön
        </Link>
        <h1 className="text-2xl font-bold text-ink-900">Kategori Düzenle</h1>
        <p className="text-sm text-ink-500 mt-1">{category.name}</p>
      </div>

      <CategoryForm
        categoryId={id}
        defaultValues={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          parentId: category.parentId ?? "",
          imageUrl: category.imageUrl ?? "",
          metaTitle: category.metaTitle ?? "",
          metaDescription: category.metaDescription ?? "",
          order: category.order,
          isActive: category.isActive,
          showInMenu: category.showInMenu,
        }}
        parentCategories={allCategories.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
