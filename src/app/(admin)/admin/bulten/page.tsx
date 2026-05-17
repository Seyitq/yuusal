import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { newsletterService } from "@/server/services/newsletter.service";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bülten Aboneleri" };

export default async function BultenPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const [subscribers, total] = await Promise.all([
    newsletterService.getAll({}),
    newsletterService.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Bülten Aboneleri</h1>
        <p className="text-sm text-ink-500 mt-1">{total} abone</p>
      </div>

      {subscribers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-400">
          <Users className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-sm">Henüz abone yok.</p>
        </div>
      ) : (
        <div className="rounded-md border border-taupe-400/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 border-b border-taupe-400/20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-ink-700 text-xs uppercase tracking-wide">E-posta</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-700 text-xs uppercase tracking-wide hidden sm:table-cell">Kaynak</th>
                <th className="px-4 py-3 text-center font-semibold text-ink-700 text-xs uppercase tracking-wide">Durum</th>
                <th className="px-4 py-3 text-right font-semibold text-ink-700 text-xs uppercase tracking-wide">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub: {
                id: string;
                email: string;
                source: string | null;
                isActive: boolean;
                subscribedAt: Date;
                unsubscribedAt: Date | null;
              }) => (
                <tr key={sub.id} className="border-b border-taupe-400/10 hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink-900">{sub.email}</td>
                  <td className="px-4 py-3 text-ink-400 text-xs hidden sm:table-cell">{sub.source ?? "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={sub.isActive ? "default" : "secondary"} className="text-[10px]">
                      {sub.isActive ? "Aktif" : "İptal"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-ink-400">
                    {new Date(sub.subscribedAt).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
