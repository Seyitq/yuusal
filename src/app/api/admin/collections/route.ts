import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { collectionService } from "@/server/services/collection.service";
import { z } from "zod";

const collectionCreateSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") === "true";

  const collections = activeOnly
    ? await collectionService.getAllActive()
    : await collectionService.getAllActive();
  return NextResponse.json(collections);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const body = await req.json();
  const parsed = collectionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { slug, ...rest } = parsed.data;
    const { generateUniqueSlug } = await import("@/lib/slugify");
    const { prisma } = await import("@/lib/prisma");
    const finalSlug = slug ?? (await generateUniqueSlug(
      rest.name,
      async (s) => (await prisma.collection.count({ where: { slug: s } })) > 0,
    ));
    const collection = await collectionService.create({ ...rest, slug: finalSlug });
    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error("Koleksiyon oluşturma hatası:", error);
    return NextResponse.json({ error: "Koleksiyon oluşturulamadı" }, { status: 500 });
  }
}
