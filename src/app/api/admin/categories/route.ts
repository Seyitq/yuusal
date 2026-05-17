import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { categoryCreateSchema } from "@/server/schemas/category.schema";
import { categoryService } from "@/server/services/category.service";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const categories = await categoryService.getAll();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = categoryCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const category = await categoryService.create(parsed.data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Kategori oluşturma hatası:", error);
    return NextResponse.json({ error: "Kategori oluşturulamadı" }, { status: 500 });
  }
}
