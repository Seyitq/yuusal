import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { blogService } from "@/server/services/blog.service";
import { BlogForm } from "@/components/admin/blog-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog Yazısı Düzenle" };

export default async function BlogDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const { id } = await params;
  const post = await blogService.getById(id);
  if (!post) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/blog" className="inline-flex items-center text-sm text-ink-500 hover:text-bronze mb-3">
          <ChevronLeft className="h-4 w-4" />
          Blog yazılarına dön
        </Link>
        <h1 className="text-2xl font-bold text-ink-900">Blog Yazısı Düzenle</h1>
        <p className="text-sm text-ink-500 mt-1">{post.title}</p>
      </div>
      <BlogForm
        postId={id}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImage: post.coverImage ?? "",
          isPublished: post.isPublished,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
        }}
      />
    </div>
  );
}
