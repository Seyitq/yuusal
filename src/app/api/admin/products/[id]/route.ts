import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { productService } from "@/server/services/product.service";
import { productUpdateSchema } from "@/server/schemas/product.schema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { id } = await params;
  const product = await productService.getById(id);
  if (!product) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const product = await productService.update(id, parsed.data);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Ürün güncelleme hatası:", error);
    return NextResponse.json({ error: "Ürün güncellenemedi" }, { status: 500 });
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
    await productService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ürün silme hatası:", error);
    return NextResponse.json({ error: "Ürün silinemedi" }, { status: 500 });
  }
}
