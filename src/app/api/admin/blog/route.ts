import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { blogService } from "@/server/services/blog.service";
import { blogCreateSchema } from "@/server/services/blog.service";
import { z } from "zod";

const listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const parsed = listSchema.safeParse(Object.fromEntries(searchParams));
  const { page = 1, perPage = 20 } = parsed.success ? parsed.data : {};

  const result = await blogService.getAll({ skip: (page - 1) * perPage, take: perPage });
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const body = await req.json();
  const parsed = blogCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const post = await blogService.create(parsed.data, session.user.id);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Blog yazısı oluşturma hatası:", error);
    return NextResponse.json({ error: "Blog yazısı oluşturulamadı" }, { status: 500 });
  }
}
