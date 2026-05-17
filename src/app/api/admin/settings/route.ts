import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { settingService } from "@/server/services/setting.service";
import { z } from "zod";

const settingsUpdateSchema = z.record(z.string(), z.string());

export async function GET(_req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const settings = await settingService.getAll();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const body = await req.json();
  const parsed = settingsUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  try {
    const entries = Object.entries(parsed.data).map(([key, value]) => ({ key, value }));
    await settingService.setMany(entries);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ayar güncelleme hatası:", error);
    return NextResponse.json({ error: "Ayarlar güncellenemedi" }, { status: 500 });
  }
}
