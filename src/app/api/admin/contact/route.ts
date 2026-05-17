import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { contactService } from "@/server/services/contact.service";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = Math.min(100, parseInt(searchParams.get("perPage") ?? "20"));

  const [messages, unread] = await Promise.all([
    contactService.getAll({ skip: (page - 1) * perPage, take: perPage }),
    contactService.countUnread(),
  ]);
  return NextResponse.json({ messages, unread, page, perPage });
}
