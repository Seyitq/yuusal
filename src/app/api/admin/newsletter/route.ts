import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { newsletterService } from "@/server/services/newsletter.service";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = Math.min(100, parseInt(searchParams.get("perPage") ?? "50"));

  const [subscribers, total] = await Promise.all([
    newsletterService.getAll({ skip: (page - 1) * perPage, take: perPage }),
    newsletterService.count(),
  ]);

  return NextResponse.json({ subscribers, total, page, perPage });
}
