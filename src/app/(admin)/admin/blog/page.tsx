import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { blogService } from "@/server/services/blog.service";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog Yazıları" };

export default async function BlogAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const posts = await blogService.getAll({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Blog Yazıları</h1>
          <p className="text-sm text-ink-500 mt-1">{posts.length} yazı</p>
        </div>
        <Link href="/admin/blog/yeni" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Yazı
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-400">
          <FileText className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-sm">Henüz blog yazısı eklenmemiş.</p>
        </div>
      ) : (
        <div className="rounded-md border border-taupe-400/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 border-b border-taupe-400/20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-ink-700 text-xs uppercase tracking-wide">Başlık</th>
                <th className="px-4 py-3 text-center font-semibold text-ink-700 text-xs uppercase tracking-wide">Durum</th>
                <th className="px-4 py-3 text-right font-semibold text-ink-700 text-xs uppercase tracking-wide hidden sm:table-cell">Tarih</th>
                <th className="px-4 py-3 text-right font-semibold text-ink-700 text-xs uppercase tracking-wide">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: {
                id: string;
                title: string;
                slug: string;
                isPublished: boolean;
                publishedAt?: Date | null;
                createdAt: Date;
              }) => (
                <tr key={post.id} className="border-b border-taupe-400/10 hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink-900">{post.title}</div>
                    <div className="text-xs text-ink-400 mt-0.5">{post.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={post.isPublished ? "default" : "secondary"} className="text-[10px]">
                      {post.isPublished ? "Yayında" : "Taslak"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-ink-400 hidden sm:table-cell">
                    {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/blog/${post.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 w-8 p-0")}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <form action={async () => {
                        "use server";
                        const { auth } = await import("@/lib/auth");
                        const { redirect } = await import("next/navigation");
                        const { blogService } = await import("@/server/services/blog.service");
                        const session = await auth();
                        if (!session?.user) return;
                        await blogService.delete(post.id);
                        redirect("/admin/blog");
                      }}>
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
