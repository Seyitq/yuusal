import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { collectionService } from "@/server/services/collection.service";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, Layers } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Koleksiyonlar" };

export default async function KoleksiyonlarPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const collections = await collectionService.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Koleksiyonlar</h1>
          <p className="text-sm text-ink-500 mt-1">{collections.length} koleksiyon</p>
        </div>
        <Link href="/admin/koleksiyonlar/yeni" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Koleksiyon
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-400">
          <Layers className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-sm">Henüz koleksiyon eklenmemiş.</p>
        </div>
      ) : (
        <div className="rounded-md border border-taupe-400/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 border-b border-taupe-400/20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-ink-700 text-xs uppercase tracking-wide">Koleksiyon</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-700 text-xs uppercase tracking-wide hidden md:table-cell">Slug</th>
                <th className="px-4 py-3 text-center font-semibold text-ink-700 text-xs uppercase tracking-wide">Durum</th>
                <th className="px-4 py-3 text-center font-semibold text-ink-700 text-xs uppercase tracking-wide hidden sm:table-cell">Öne Çıkan</th>
                <th className="px-4 py-3 text-right font-semibold text-ink-700 text-xs uppercase tracking-wide">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col: {
                id: string;
                name: string;
                slug: string;
                isActive: boolean;
                isFeatured: boolean;
              }) => (
                <tr key={col.id} className="border-b border-taupe-400/10 hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink-900">{col.name}</td>
                  <td className="px-4 py-3 text-ink-400 text-xs hidden md:table-cell">{col.slug}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={col.isActive ? "default" : "secondary"} className="text-[10px]">
                      {col.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {col.isFeatured && <Badge variant="outline" className="text-[10px]">Evet</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/koleksiyonlar/${col.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 w-8 p-0")}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          const { auth } = await import("@/lib/auth");
                          const { redirect } = await import("next/navigation");
                          const { collectionService } = await import("@/server/services/collection.service");
                          const session = await auth();
                          if (!session?.user) return;
                          await collectionService.delete(col.id);
                          redirect("/admin/koleksiyonlar");
                        }}
                      >
                        <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
