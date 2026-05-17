import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { settingService } from "@/server/services/setting.service";
import { SettingsForm } from "@/components/admin/settings-form";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Ayarlar" };

export default async function AyarlarPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  const settings = await settingService.getAll();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Ayarlar</h1>
        <p className="text-sm text-ink-500 mt-1">Site geneli ayarları buradan yönetebilirsiniz.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
