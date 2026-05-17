import type { Metadata } from "next";
import { blogService } from "@/server/services/blog.service";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Blog",
  description: "YUUŞAL blog yazıları",
};

export default async function BlogPage() {
  const posts = await blogService.getPublished({ take: 30 });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-ink-900 font-light mb-12">Blog</h1>

      {posts.length === 0 ? (
        <p className="font-sans text-sm text-ink-400">Henüz yazı yok.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              {post.coverImage && (
                <div className="relative aspect-[16/9] overflow-hidden bg-cream-100 mb-4">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="space-y-2">
                {post.publishedAt && (
                  <p className="font-sans text-xs text-ink-400 uppercase tracking-wider">
                    {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                <h2 className="font-serif text-xl text-ink-900 group-hover:text-taupe-600 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="font-sans text-sm text-ink-500 line-clamp-3">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}