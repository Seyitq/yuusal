import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { slideService } from "@/server/services/slide.service";
import { SlideForm } from "@/components/admin/slide-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Slayt Düzenle" };

export default async function SliderDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const { id } = await params;
  const slide = await slideService.getById(id);
  if (!slide) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/slider" className="inline-flex items-center text-sm text-ink-500 hover:text-bronze mb-3">
          <ChevronLeft className="h-4 w-4" />
          Slider&apos;a dön
        </Link>
        <h1 className="text-2xl font-bold text-ink-900">Slayt Düzenle</h1>
      </div>
      <SlideForm
        slideId={id}
        defaultValues={{
          title: slide.title ?? "",
          subtitle: slide.subtitle ?? "",
          ctaText: slide.ctaText ?? "",
          ctaLink: slide.ctaLink ?? "",
          desktopImage: slide.desktopImage,
          mobileImage: slide.mobileImage ?? "",
          order: slide.order,
          isActive: slide.isActive,
        }}
      />
    </div>
  );
}
