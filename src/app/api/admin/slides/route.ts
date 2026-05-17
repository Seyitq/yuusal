import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { slideService } from "@/server/services/slide.service";
import { z } from "zod";

const slideCreateSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  // javascript: ve data: URI enjeksiyonunu engelle — sadece / veya http(s) ile başlayan URL'ler
  ctaLink: z
    .string()
    .optional()
    .refine(
      (v) => !v || v.startsWith("/") || v.startsWith("https://") || v.startsWith("http://"),
      { message: "Geçersiz URL. '/' veya 'https://' ile başlamalıdır." },
    ),
  desktopImage: z.string().min(1),
  mobileImage: z.string().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") === "true";

  const slides = activeOnly ? await slideService.getActiveSlides() : await slideService.getAll();
  return NextResponse.json(slides);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const body = await req.json();
  const parsed = slideCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const slide = await slideService.create(parsed.data);
    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error("Slide oluşturma hatası:", error);
    return NextResponse.json({ error: "Slide oluşturulamadı" }, { status: 500 });
  }
}
