import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { blogService } from "@/server/services/blog.service";
import { z } from "zod";

const blogUpdateSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional(),
  coverImage: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = blogUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { isPublished, ...rest } = parsed.data;
    const post = await blogService.update(id, {
      ...rest,
      ...(isPublished !== undefined && {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      }),
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog güncelleme hatası:", error);
    return NextResponse.json({ error: "Blog yazısı güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { id } = await params;
  try {
    await blogService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog silme hatası:", error);
    return NextResponse.json({ error: "Blog yazısı silinemedi" }, { status: 500 });
  }
}
