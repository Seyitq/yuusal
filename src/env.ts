/**
 * Zod ile sunucu ortam değişkeni validasyonu.
 * Bu modül import edildiğinde validasyon çalışır ve hatalı env ile sunucu başlamaz.
 *
 * Kullanım: import "@/env" (yan etki için) veya import { env } from "@/env"
 */
import { z } from "zod";

const WEAK_SECRETS = new Set([
  "dev-secret-please-change-in-production",
  "generate-with-openssl-rand-base64-32",
  "changeme",
  "secret",
  "password",
  "12345678901234567890123456789012",
]);

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL zorunludur"),
  // NextAuth v5 AUTH_SECRET veya NEXTAUTH_SECRET kullanır
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET en az 32 karakter olmalıdır").optional(),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET en az 32 karakter olmalıdır").optional(),
  UPLOAD_DIR: z.string().default("./public/uploads"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().min(1).max(100).default(10),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Geçersiz ortam değişkenleri:");
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error("Ortam değişkenleri geçersiz. Sunucu başlatılamıyor.");
}

const data = parsed.data;

// En az bir auth secret tanımlı olmalı
const authSecret = data.AUTH_SECRET ?? data.NEXTAUTH_SECRET;
if (!authSecret) {
  throw new Error("AUTH_SECRET veya NEXTAUTH_SECRET tanımlanmamış. Sunucu başlatılamıyor.");
}

// Üretim ortamında zayıf secret engellenir
if (data.NODE_ENV === "production" && WEAK_SECRETS.has(authSecret)) {
  throw new Error(
    "Üretim ortamında zayıf AUTH_SECRET kullanılamaz. 'openssl rand -base64 32' ile yeni bir secret üretin.",
  );
}

export const env = {
  ...data,
  authSecret,
} as const;
