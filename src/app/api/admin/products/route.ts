import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { productCreateSchema } from "@/server/schemas/product.schema";
import { productService } from "@/server/services/product.service";
import { paginationSchema } from "@/server/schemas/common.schema";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pagination = paginationSchema.parse({
    page: searchParams.get("page"),
    perPage: searchParams.get("perPage"),
  });

  const products = await productService.listFeatured(pagination.perPage);
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = productCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const product = await productService.create(parsed.data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Ürün oluşturma hatası:", error);
    return NextResponse.json({ error: "Ürün oluşturulamadı" }, { status: 500 });
  }
}
