import { NextResponse } from "next/server";
import { contactService, contactCreateSchema } from "@/server/services/contact.service";

export async function POST(req: Request) {
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
