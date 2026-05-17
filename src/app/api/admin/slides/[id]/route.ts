import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { slideService } from "@/server/services/slide.service";
import { z } from "zod";

const slideUpdateSchema = z.object({
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  ctaText: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  desktopImage: z.string().optional(),
  mobileImage: z.string().optional().nullable(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = slideUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const slide = await slideService.update(id, parsed.data);
    return NextResponse.json(slide);
  } catch (error) {
    console.error("Slide güncelleme hatası:", error);
    return NextResponse.json({ error: "Slide güncellenemedi" }, { status: 500 });
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
    await slideService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Slide silme hatası:", error);
    return NextResponse.json({ error: "Slide silinemedi" }, { status: 500 });
  }
}
