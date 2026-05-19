import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Kuruş cinsinden fiyatı ₺ olarak biçimlendirir.
 * Örnek: 29900 → "299 ₺" | 29950 → "299,50 ₺"
 */
export function formatPrice(kuruş: number): string {
  const tl = kuruş / 100;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: tl % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(tl);
}
