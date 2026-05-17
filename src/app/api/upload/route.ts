import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadService } from "@/server/services/upload.service";
import { z } from "zod";

const categorySchema = z.enum(["products", "slider", "general", "blog"]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const categoryParsed = categorySchema.safeParse(searchParams.get("category") ?? "general");

  if (!categoryParsed.success) {
    return NextResponse.json({ error: "Geçersiz kategori" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadService.processAndSave(buffer, file.type, categoryParsed.data);

    return NextResponse.json({ url: result.url, alt: "" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yükleme başarısız";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
