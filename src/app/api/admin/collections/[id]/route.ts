import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { collectionService } from "@/server/services/collection.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const collectionUpdateSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  coverImage: z.string().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = collectionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const collection = await collectionService.update(id, parsed.data);
    // Anasayfa ve koleksiyon sayfalarının cache'ini temizle
    revalidatePath("/");
    revalidatePath(`/koleksiyon/${collection.slug}`);
    return NextResponse.json(collection);
  } catch (error) {
    console.error("Koleksiyon güncelleme hatası:", error);
    return NextResponse.json({ error: "Koleksiyon güncellenemedi" }, { status: 500 });
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
    await collectionService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Koleksiyon silme hatası:", error);
    return NextResponse.json({ error: "Koleksiyon silinemedi" }, { status: 500 });
  }
}
