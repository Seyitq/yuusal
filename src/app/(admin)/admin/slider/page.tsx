import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { slideService } from "@/server/services/slide.service";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import NextImage from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Hero Slider" };

export default async function SliderPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const slides = await slideService.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Hero Slider</h1>
          <p className="text-sm text-ink-500 mt-1">{slides.length} slayt — sıra alanına göre sıralanır</p>
        </div>
        <Link href="/admin/slider/yeni" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Slayt
        </Link>
      </div>

      {slides.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-400">
          <ImageIcon className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-sm">Henüz slayt eklenmemiş.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide: {
            id: string;
            title?: string | null;
            subtitle?: string | null;
            desktopImage: string;
            order: number;
            isActive: boolean;
          }) => (
            <div key={slide.id} className="flex items-center gap-4 rounded-lg border border-taupe-400/30 p-3 bg-white hover:bg-cream-50 transition-colors">
              <div className="relative w-24 h-14 rounded overflow-hidden bg-cream-100 flex-shrink-0">
                <NextImage src={slide.desktopImage} alt={slide.title ?? "Slayt"} fill className="object-cover" sizes="96px" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink-900 truncate">{slide.title ?? "—"}</span>
                  <Badge variant={slide.isActive ? "default" : "secondary"} className="text-[10px] flex-shrink-0">
                    {slide.isActive ? "Aktif" : "Pasif"}
                  </Badge>
                </div>
                {slide.subtitle && <p className="text-xs text-ink-500 truncate mt-0.5">{slide.subtitle}</p>}
                <p className="text-xs text-ink-300 mt-0.5">Sıra: {slide.order}</p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Link href={`/admin/slider/${slide.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 w-8 p-0")}>
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                <form action={async () => {
                  "use server";
                  const { auth } = await import("@/lib/auth");
                  const { redirect } = await import("next/navigation");
                  const { slideService } = await import("@/server/services/slide.service");
                  const session = await auth();
                  if (!session?.user) return;
                  await slideService.delete(slide.id);
                  redirect("/admin/slider");
                }}>
                  <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
