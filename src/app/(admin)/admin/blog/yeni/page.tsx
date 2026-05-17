import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BlogForm } from "@/components/admin/blog-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Yeni Blog Yazısı" };

export default async function YeniBlogPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/blog" className="inline-flex items-center text-sm text-ink-500 hover:text-bronze mb-3">
          <ChevronLeft className="h-4 w-4" />
          Blog yazılarına dön
        </Link>
        <h1 className="text-2xl font-bold text-ink-900">Yeni Blog Yazısı</h1>
      </div>
      <BlogForm />
    </div>
  );
}
