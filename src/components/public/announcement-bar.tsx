import { settingService } from "@/server/services/setting.service";
import { AnnouncementTicker } from "./announcement-ticker";

export async function AnnouncementBar() {
  const [messagesJson, isActive] = await Promise.all([
    settingService.get("announcementBar.messages"),
    settingService.get("announcementBar.isActive"),
  ]);

  if (isActive !== "true") return null;

  let messages: string[] = [];
  try {
    messages = JSON.parse(messagesJson);
  } catch {
    messages = messagesJson ? [messagesJson] : [];
  }

  if (!messages.length) return null;

  return (
    <div className="bg-ink-900 text-cream-100 py-2.5">
      <AnnouncementTicker messages={messages} />
    </div>
  );
}