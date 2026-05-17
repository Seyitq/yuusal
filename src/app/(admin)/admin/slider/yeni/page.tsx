import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SlideForm } from "@/components/admin/slide-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Yeni Slayt" };

export default async function YeniSliderPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/slider" className="inline-flex items-center text-sm text-ink-500 hover:text-bronze mb-3">
          <ChevronLeft className="h-4 w-4" />
          Slider&apos;a dön
        </Link>
        <h1 className="text-2xl font-bold text-ink-900">Yeni Slayt</h1>
      </div>
      <SlideForm />
    </div>
  );
}
