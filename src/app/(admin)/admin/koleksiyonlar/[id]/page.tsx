import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { collectionService } from "@/server/services/collection.service";
import { CollectionForm } from "@/components/admin/collection-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Koleksiyon Düzenle" };

export default async function KoleksiyonDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const { id } = await params;
  const collection = await collectionService.getBySlug(id).catch(() => null) ??
    (await collectionService.getAll()).find((c: { id: string }) => c.id === id) ?? null;

  if (!collection) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/koleksiyonlar" className="inline-flex items-center text-sm text-ink-500 hover:text-bronze mb-3">
          <ChevronLeft className="h-4 w-4" />
          Koleksiyonlara dön
        </Link>
        <h1 className="text-2xl font-bold text-ink-900">Koleksiyon Düzenle</h1>
        <p className="text-sm text-ink-500 mt-1">{collection.name}</p>
      </div>
      <CollectionForm
        collectionId={id}
        defaultValues={{
          name: collection.name,
          slug: collection.slug,
          description: collection.description ?? "",
          metaTitle: collection.metaTitle ?? "",
          metaDescription: collection.metaDescription ?? "",
          isActive: collection.isActive,
          isFeatured: collection.isFeatured,
        }}
      />
    </div>
  );
}
