import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { contactService } from "@/server/services/contact.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, CheckCheck, Reply } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "İletişim Mesajları" };

export default async function IletisimMesajlariPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const [messages, unread] = await Promise.all([
    contactService.getAll({}),
    contactService.countUnread(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">İletişim Mesajları</h1>
          <p className="text-sm text-ink-500 mt-1">
            {messages.length} mesaj{unread > 0 && <span className="text-red-500 font-medium"> · {unread} okunmamış</span>}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-400">
          <MessageSquare className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-sm">Henüz mesaj yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg: {
            id: string;
            name: string;
            email: string;
            phone?: string | null;
            subject?: string | null;
            message: string;
            isRead: boolean;
            isReplied: boolean;
            notes?: string | null;
            createdAt: Date;
          }) => (
            <div
              key={msg.id}
              className={`rounded-lg border p-4 space-y-2 transition-colors ${
                !msg.isRead ? "border-bronze/40 bg-bronze/5" : "border-taupe-400/30 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink-900">{msg.name}</span>
                  {!msg.isRead && <Badge variant="destructive" className="text-[10px]">Yeni</Badge>}
                  {msg.isReplied && <Badge variant="outline" className="text-[10px]">Yanıtlandı</Badge>}
                </div>
                <span className="text-xs text-ink-300 whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleDateString("tr-TR", {
                    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="text-xs text-ink-500 flex gap-4">
                <a href={`mailto:${msg.email}`} className="hover:text-bronze">{msg.email}</a>
                {msg.phone && <span>{msg.phone}</span>}
              </div>

              {msg.subject && (
                <p className="text-sm font-medium text-ink-700">{msg.subject}</p>
              )}

              <p className="text-sm text-ink-600 whitespace-pre-wrap">{msg.message}</p>

              <div className="flex items-center gap-2 pt-1">
                {!msg.isRead && (
                  <form action={async () => {
                    "use server";
                    const { auth } = await import("@/lib/auth");
                    const { contactService } = await import("@/server/services/contact.service");
                    const session = await auth();
                    if (!session?.user) return;
                    await contactService.markRead(msg.id);
                  }}>
                    <Button type="submit" variant="outline" size="sm" className="h-7 text-xs">
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Okundu İşaretle
                    </Button>
                  </form>
                )}
                {!msg.isReplied && (
                  <form action={async () => {
                    "use server";
                    const { auth } = await import("@/lib/auth");
                    const { contactService } = await import("@/server/services/contact.service");
                    const session = await auth();
                    if (!session?.user) return;
                    await contactService.markReplied(msg.id);
                  }}>
                    <Button type="submit" variant="outline" size="sm" className="h-7 text-xs">
                      <Reply className="h-3 w-3 mr-1" />
                      Yanıtlandı İşaretle
                    </Button>
                  </form>
                )}
                <form action={async () => {
                  "use server";
                  const { auth } = await import("@/lib/auth");
                  const { redirect } = await import("next/navigation");
                  const { contactService } = await import("@/server/services/contact.service");
                  const session = await auth();
                  if (!session?.user) return;
                  await contactService.delete(msg.id);
                  redirect("/admin/iletisim-mesajlari");
                }}>
                  <Button type="submit" variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:text-red-700">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Sil
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
