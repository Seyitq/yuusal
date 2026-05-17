import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { categoryService } from "@/server/services/category.service";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kategoriler" };

export default async function KategorilerPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const categories = await categoryService.getAll();
  const topLevel = categories.filter((c: { parentId: string | null }) => !c.parentId);
  const children = categories.filter((c: { parentId: string | null }) => !!c.parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Kategoriler</h1>
          <p className="text-sm text-ink-500 mt-1">{categories.length} kategori</p>
        </div>
        <Link href="/admin/kategoriler/yeni" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kategori
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-400">
          <FolderTree className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-sm">Henüz kategori eklenmemiş.</p>
        </div>
      ) : (
        <div className="rounded-md border border-taupe-400/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 border-b border-taupe-400/20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-ink-700 text-xs uppercase tracking-wide">Kategori</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-700 text-xs uppercase tracking-wide hidden md:table-cell">Slug</th>
                <th className="px-4 py-3 text-center font-semibold text-ink-700 text-xs uppercase tracking-wide">Durum</th>
                <th className="px-4 py-3 text-center font-semibold text-ink-700 text-xs uppercase tracking-wide hidden sm:table-cell">Menü</th>
                <th className="px-4 py-3 text-right font-semibold text-ink-700 text-xs uppercase tracking-wide">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {topLevel.map((cat: { id: string; name: string; slug: string; isActive: boolean; showInMenu: boolean }) => (
                <>
                  <CategoryRow key={cat.id} cat={cat} />
                  {children
                    .filter((c: { parentId: string | null }) => c.parentId === cat.id)
                    .map((child: { id: string; name: string; slug: string; isActive: boolean; showInMenu: boolean }) => (
                      <CategoryRow key={child.id} cat={child} isChild />
                    ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CategoryRow({ cat, isChild = false }: {
  cat: { id: string; name: string; slug: string; isActive: boolean; showInMenu: boolean };
  isChild?: boolean;
}) {
  return (
    <tr className="border-b border-taupe-400/10 hover:bg-cream-50 transition-colors">
      <td className="px-4 py-3">
        <span className={isChild ? "pl-6 text-ink-600" : "font-medium text-ink-900"}>
          {isChild && <span className="text-taupe-400 mr-2">└</span>}
          {cat.name}
        </span>
      </td>
      <td className="px-4 py-3 text-ink-400 text-xs hidden md:table-cell">{cat.slug}</td>
      <td className="px-4 py-3 text-center">
        <Badge variant={cat.isActive ? "default" : "secondary"} className="text-[10px]">
          {cat.isActive ? "Aktif" : "Pasif"}
        </Badge>
      </td>
      <td className="px-4 py-3 text-center hidden sm:table-cell">
        <Badge variant={cat.showInMenu ? "outline" : "secondary"} className="text-[10px]">
          {cat.showInMenu ? "Evet" : "Hayır"}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/kategoriler/${cat.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 w-8 p-0")}>
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <form
            action={async () => {
              "use server";
              const { auth } = await import("@/lib/auth");
              const { redirect } = await import("next/navigation");
              const { categoryService } = await import("@/server/services/category.service");
              const session = await auth();
              if (!session?.user) return;
              await categoryService.delete(cat.id);
              redirect("/admin/kategoriler");
            }}
          >
            <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </td>
    </tr>
  );
}
