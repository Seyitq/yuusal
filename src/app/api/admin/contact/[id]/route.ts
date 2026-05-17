import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { contactService } from "@/server/services/contact.service";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum(["markRead", "markReplied", "updateNotes"]),
  notes: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
  }

  try {
    if (parsed.data.action === "markRead") {
      await contactService.markRead(id);
    } else if (parsed.data.action === "markReplied") {
      await contactService.markReplied(id);
    } else if (parsed.data.action === "updateNotes") {
      await contactService.updateNotes(id, parsed.data.notes ?? "");
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mesaj güncelleme hatası:", error);
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
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
    await contactService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mesaj silme hatası:", error);
    return NextResponse.json({ error: "Mesaj silinemedi" }, { status: 500 });
  }
}
