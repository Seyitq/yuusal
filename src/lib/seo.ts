import type { Metadata } from "next";
import { settingService } from "@/server/services/setting.service";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function buildMetadata(overrides: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}): Promise<Metadata> {
  const [defaultTitle, defaultDescription] = await Promise.all([
    settingService.get("seo.defaultTitle"),
    settingService.get("seo.defaultDescription"),
  ]);

  const title = overrides.title ?? defaultTitle;
  const description = overrides.description ?? defaultDescription;

  return {
    title,
    description,
    ...(overrides.noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: "YUUŞAL",
      locale: "tr_TR",
      type: "website",
      ...(overrides.image && { images: [{ url: overrides.image }] }),
    },
  };
}
