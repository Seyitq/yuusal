"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface Setting {
  key: string;
  value: string;
}

interface SettingsFormProps {
  settings: Setting[];
}

function SettingField({ label, value, name, type = "text", hint }: {
  label: string;
  value: string;
  name: string;
  type?: "text" | "textarea" | "tel" | "url";
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      {type === "textarea" ? (
        <Textarea id={name} name={name} defaultValue={value} rows={3} />
      ) : (
        <Input id={name} name={name} type={type} defaultValue={value} />
      )}
      {hint && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

function SettingsSection({ title, children, name, onSave }: {
  title: string;
  children: React.ReactNode;
  name: string;
  onSave: (formData: FormData) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">{children}</div>
      <div className="pt-2">
        <Button type="submit" disabled={saving} className="min-w-[120px]">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {title} Kaydet
        </Button>
      </div>
    </form>
  );
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const get = (key: string) => settings.find((s) => s.key === key)?.value ?? "";

  const saveSettings = async (formData: FormData) => {
    const data: Record<string, string> = {};
    formData.forEach((v, k) => { data[k] = v.toString(); });

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast.error("Ayarlar kaydedilemedi.");
      return;
    }
    toast.success("Ayarlar kaydedildi.");
    router.refresh();
  };

  return (
    <Tabs defaultValue="genel">
      <TabsList className="mb-6">
        <TabsTrigger value="genel">Genel</TabsTrigger>
        <TabsTrigger value="iletisim">İletişim</TabsTrigger>
        <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        <TabsTrigger value="sosyal">Sosyal Medya</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
      </TabsList>

      <TabsContent value="genel">
        <SettingsSection title="Genel" name="genel" onSave={saveSettings}>
          <SettingField name="siteName" label="Site Adı" value={get("siteName")} />
          <SettingField name="siteTagline" label="Slogan" value={get("siteTagline")} />
          <SettingField name="announcementBar" label="Duyuru Çubuğu Metni" value={get("announcementBar")}
            hint="Boş bırakılırsa duyuru çubuğu gösterilmez." />
          <SettingField name="announcementBarLink" label="Duyuru Çubuğu Linki" value={get("announcementBarLink")} />
        </SettingsSection>
      </TabsContent>

      <TabsContent value="iletisim">
        <SettingsSection title="İletişim" name="iletisim" onSave={saveSettings}>
          <SettingField name="contactEmail" label="İletişim E-postası" value={get("contactEmail")} type="text" />
          <SettingField name="contactPhone" label="Telefon" value={get("contactPhone")} type="tel" />
          <SettingField name="contactAddress" label="Adres" value={get("contactAddress")} type="textarea" />
        </SettingsSection>
      </TabsContent>

      <TabsContent value="whatsapp">
        <SettingsSection title="WhatsApp" name="whatsapp" onSave={saveSettings}>
          <SettingField
            name="whatsappPhone"
            label="WhatsApp Numarası"
            value={get("whatsappPhone")}
            type="tel"
            hint="Ülke kodu dahil giriniz. Örnek: 905551234567"
          />
          <SettingField
            name="whatsappMessageTemplate"
            label="Mesaj Şablonu"
            value={get("whatsappMessageTemplate")}
            type="textarea"
            hint="{productName} alanı ürün adıyla değiştirilir."
          />
        </SettingsSection>
      </TabsContent>

      <TabsContent value="sosyal">
        <SettingsSection title="Sosyal Medya" name="sosyal" onSave={saveSettings}>
          <SettingField name="socialInstagram" label="Instagram URL" value={get("socialInstagram")} type="url" />
          <SettingField name="socialFacebook" label="Facebook URL" value={get("socialFacebook")} type="url" />
          <SettingField name="socialPinterest" label="Pinterest URL" value={get("socialPinterest")} type="url" />
          <SettingField name="socialTiktok" label="TikTok URL" value={get("socialTiktok")} type="url" />
        </SettingsSection>
      </TabsContent>

      <TabsContent value="seo">
        <SettingsSection title="SEO" name="seo" onSave={saveSettings}>
          <SettingField name="metaTitle" label="Varsayılan Meta Başlık" value={get("metaTitle")} />
          <SettingField name="metaDescription" label="Varsayılan Meta Açıklama" value={get("metaDescription")} type="textarea" />
          <Separator />
          <SettingField name="googleAnalyticsId" label="Google Analytics ID" value={get("googleAnalyticsId")}
            hint="Örnek: G-XXXXXXXXXX" />
          <SettingField name="googleSearchConsoleId" label="Google Search Console Doğrulama Kodu" value={get("googleSearchConsoleId")} />
        </SettingsSection>
      </TabsContent>
    </Tabs>
  );
}
