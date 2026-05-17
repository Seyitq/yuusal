/**
 * In-memory IP tabanlı rate limiter.
 *
 * Üretimde birden fazla Next.js instance (yatay ölçekleme) varsa
 * Redis tabanlı bir çözüme (örn. @upstash/ratelimit) geçilmelidir.
 * Tek instance (Docker Compose) için bu implementasyon yeterlidir.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Pencere anahtarı → istek sayısı
const store = new Map<string, RateLimitEntry>();

// Süresi dolmuş kayıtları 5 dakikada bir temizle (bellek sızıntısı önlemi)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanupScheduled() {
  if (cleanupTimer !== null) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, CLEANUP_INTERVAL_MS);
  // Node.js process'in kapanmasını engelleme
  if (cleanupTimer.unref) cleanupTimer.unref();
}

/**
 * IP bazlı rate limiting kontrolü yapar.
 * @param ip - İstemci IP adresi
 * @param limit - Pencere başına izin verilen maksimum istek sayısı
 * @param windowMs - Pencere süresi (milisaniye cinsinden)
 * @returns `true` = istek kabul edildi, `false` = limit aşıldı
 */
export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  ensureCleanupScheduled();

  const now = Date.now();
  // Her IP + zaman penceresi kombinasyonu için benzersiz anahtar
  const windowKey = Math.floor(now / windowMs).toString();
  const key = `${ip}:${windowKey}`;

  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count += 1;
  return true;
}

/**
 * Next.js Request nesnesinden gerçek istemci IP'sini çıkarır.
 * Caddy/nginx gibi reverse proxy arkasında çalışmayı destekler.
 */
export function getClientIp(req: Request): string {
  // Caddy/nginx x-forwarded-for header'ı (birden fazla proxy varsa ilk IP gerçek client)
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  // Alternatif header
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
