import { settingService } from "@/server/services/setting.service";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { FloatingButtonsClient } from "./floating-buttons-client";

export async function FloatingButtons() {
  const [phone, template, instagram] = await Promise.all([
    settingService.get("whatsapp.number"),
    settingService.get("whatsapp.generalTemplate"),
    settingService.get("social.instagram"),
  ]);

  const waUrl = buildWhatsAppUrl({ phoneNumber: phone, template });

  return <FloatingButtonsClient waUrl={waUrl} instagramUrl={instagram} />;
}