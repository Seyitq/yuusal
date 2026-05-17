import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogService } from "@/server/services/blog.service";
import { renderRichText } from "@/lib/rich-text";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogService.getBySlug(slug);
  if (!post) return {};
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.metaTitle ?? post.title,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await blogService.getBySlug(slug);

  if (!post || !post.isPublished) notFound();

  const safeContent = renderRichText(post.content);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-sans text-ink-400 mb-8">
        <Link href="/" className="hover:text-ink-900 transition-colors">Anasayfa</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-ink-900 transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-ink-700">{post.title}</span>
      </nav>

      {/* Başlık */}
      <header className="mb-10">
        {post.publishedAt && (
          <p className="font-sans text-xs uppercase tracking-widest text-ink-400 mb-4">
            {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
        <h1 className="font-serif text-4xl md:text-5xl text-ink-900 font-light leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="font-sans text-base text-ink-500 mt-4 leading-relaxed">{post.excerpt}</p>
        )}
      </header>

      {/* Kapak Görseli */}
      {post.coverImage && (
        <div className="relative aspect-[16/9] overflow-hidden bg-cream-100 mb-10">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* İçerik */}
      <div
        className="prose prose-sm max-w-none font-sans text-ink-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {/* Etiketler */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-cream-200">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="font-sans text-xs text-ink-400 border border-ink-200 px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/blog"
          className="font-sans text-xs uppercase tracking-widest text-ink-500 hover:text-ink-900 transition-colors"
        >
          ← Tüm Yazılar
        </Link>
      </div>
    </article>
  );
}