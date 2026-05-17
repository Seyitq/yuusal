import { NextResponse } from "next/server";
import { contactService, contactCreateSchema } from "@/server/services/contact.service";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limit: aynı IP'den dakikada en fazla 5 istek
  const ip = getClientIp(req);
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen bir dakika bekleyip tekrar deneyin." },
      { status: 429 },
    );
  }

  const body = await req.json();
  const parsed = contactCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await contactService.submit(parsed.data);
    return NextResponse.json({ message: "Mesajınız iletildi. En kısa sürede dönüş yapacağız." });
  } catch (error) {
    console.error("İletişim formu hatası:", error);
    return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 });
  }
}
