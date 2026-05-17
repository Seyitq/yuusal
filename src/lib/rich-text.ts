/**
 * Tiptap JSON içeriğini güvenli HTML'e dönüştürür.
 *
 * - İçerik Tiptap JSON ise: generateHTML ile proper HTML üretilir, ardından sanitize edilir.
 * - İçerik ham HTML ise (admin API'ye doğrudan POST ile bypass edilmiş): sanitize edilir.
 *
 * Güvenlik notu: dangerouslySetInnerHTML kullanılan her yerde bu fonksiyon çağrılmalıdır.
 * javascript: URI'ları ve script/event handler enjeksiyonları engellenir.
 */
import sanitizeHtml from "sanitize-html";
import { generateHTML } from "@tiptap/core";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

const TIPTAP_EXTENSIONS = [StarterKit, Image, Link];

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "img",
    "h1",
    "h2",
    "h3",
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "width", "height"],
    a: ["href", "target", "rel"],
    "*": ["class"],
  },
  // javascript: ve data: URI'larını engelle
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
};

/**
 * Tiptap JSON veya ham HTML içeriğini sanitize edilmiş HTML döndürür.
 * @param content - Tiptap JSON string veya ham HTML string
 */
export function renderRichText(content: string): string {
  if (!content) return "";

  // Tiptap JSON kontrolü — JSON parse başarılı ve tip "doc" ise
  try {
    const json = JSON.parse(content) as JSONContent;
    if (json.type === "doc" && Array.isArray(json.content)) {
      const html = generateHTML(json, TIPTAP_EXTENSIONS);
      return sanitizeHtml(html, SANITIZE_OPTIONS);
    }
  } catch {
    // JSON değil, ham HTML olarak işle
  }

  // Ham HTML → sanitize et
  return sanitizeHtml(content, SANITIZE_OPTIONS);
}
