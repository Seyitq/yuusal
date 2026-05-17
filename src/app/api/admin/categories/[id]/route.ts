import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { categoryService } from "@/server/services/category.service";
import { categoryUpdateSchema } from "@/server/schemas/category.schema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { id } = await params;
  const category = await categoryService.getById(id);
  if (!category) return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
  return NextResponse.json(category);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = categoryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const category = await categoryService.update(id, parsed.data);
    return NextResponse.json(category);
  } catch (error) {
    console.error("Kategori güncelleme hatası:", error);
    return NextResponse.json({ error: "Kategori güncellenemedi" }, { status: 500 });
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
    await categoryService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kategori silme hatası:", error);
    return NextResponse.json({ error: "Kategori silinemedi" }, { status: 500 });
  }
}
