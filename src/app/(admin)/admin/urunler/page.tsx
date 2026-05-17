import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { productService } from "@/server/services/product.service";
import { categoryService } from "@/server/services/category.service";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Ürünler" };

export default async function UrunlerPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const [{ products }, categories] = await Promise.all([
    productService.listAll({}),
    categoryService.getAll(),
  ]);

  const categoryMap = Object.fromEntries(categories.map((c: { id: string; name: string }) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Ürünler</h1>
          <p className="text-sm text-ink-500 mt-1">{products.length} ürün</p>
        </div>
        <Link href="/admin/urunler/yeni" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Ürün
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-400">
          <Package className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-sm">Henüz ürün eklenmemiş.</p>
          <Link href="/admin/urunler/yeni" className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>İlk ürünü ekle</Link>
        </div>
      ) : (
        <div className="rounded-md border border-taupe-400/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 border-b border-taupe-400/20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-ink-700 text-xs uppercase tracking-wide">Görsel</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-700 text-xs uppercase tracking-wide">Ürün</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-700 text-xs uppercase tracking-wide hidden md:table-cell">SKU</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-700 text-xs uppercase tracking-wide hidden lg:table-cell">Kategori</th>
                <th className="px-4 py-3 text-center font-semibold text-ink-700 text-xs uppercase tracking-wide">Durum</th>
                <th className="px-4 py-3 text-right font-semibold text-ink-700 text-xs uppercase tracking-wide">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: {
                id: string;
                name: string;
                sku: string;
                categoryId: string;
                isActive: boolean;
                isFeatured: boolean;
                images: { url: string; alt: string | null; isMain: boolean }[];
              }) => {
                const primaryImage = product.images.find((img) => img.isMain) ?? product.images[0];
                return (
                  <tr key={product.id} className="border-b border-taupe-400/10 hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3">
                      {primaryImage ? (
                        <div className="relative h-10 w-10 rounded-md overflow-hidden border border-taupe-400/20">
                          <Image src={primaryImage.url} alt={primaryImage.alt ?? ""} fill className="object-cover" sizes="40px" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-cream-200 flex items-center justify-center">
                          <Package className="h-4 w-4 text-ink-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-900">{product.name}</p>
                      {product.isFeatured && (
                        <span className="text-[10px] text-bronze font-medium">Öne Çıkan</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-500 hidden md:table-cell">{product.sku}</td>
                    <td className="px-4 py-3 text-ink-500 hidden lg:table-cell">
                      {categoryMap[product.categoryId] ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={product.isActive ? "default" : "secondary"} className="text-[10px]">
                        {product.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/urunler/${product.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 w-8 p-0")}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// İnline delete butonu (client-side)
function DeleteProductButton({ productId }: { productId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const { auth } = await import("@/lib/auth");
        const { redirect } = await import("next/navigation");
        const { productService } = await import("@/server/services/product.service");
        const session = await auth();
        if (!session?.user) return;
        await productService.delete(productId);
        redirect("/admin/urunler");
      }}
    >
      <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </form>
  );
}
