import { NextResponse } from "next/server";
import { newsletterService, newsletterSubscribeSchema } from "@/server/services/newsletter.service";

export async function POST(req: Request) {
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
