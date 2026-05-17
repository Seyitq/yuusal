import { NextResponse } from "next/server";
import { newsletterService, newsletterSubscribeSchema } from "@/server/services/newsletter.service";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limit: aynı IP'den dakikada en fazla 3 abonelik isteği
  const ip = getClientIp(req);
  if (!rateLimit(ip, 3, 60_000)) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen bir dakika bekleyip tekrar deneyin." },
      { status: 429 },
    );
  }

  const body = await req.json();
  const parsed = newsletterSubscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await newsletterService.subscribe(parsed.data);
    return NextResponse.json({ message: "Bültenimize başarıyla abone oldunuz." });
  } catch (error) {
    console.error("Bülten abonelik hatası:", error);
    return NextResponse.json({ error: "Abonelik işlemi gerçekleştirilemedi." }, { status: 500 });
  }
}
