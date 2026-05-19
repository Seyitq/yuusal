/**
 * Tiptap JSON içeriğini güvenli HTML'e dönüştürür.
 *
 * - İçerik Tiptap JSON ise: sunucu tarafında güvenli recursive renderer kullanılır.
 *   (Tiptap'ın generateHTML() Node.js ortamında window bağımlılığı nedeniyle çalışmaz.)
 * - İçerik ham HTML ise: sanitize edilir.
 *
 * Güvenlik notu: dangerouslySetInnerHTML kullanan her yerde bu fonksiyon çağrılmalıdır.
 * javascript: URI'ları ve script/event handler enjeksiyonları engellenir.
 */
import sanitizeHtml from "sanitize-html";

// ---- Tiptap JSON Tipleri ----
interface TiptapMark {
  type: string;
  attrs?: Record<string, string | number | boolean | null>;
}

interface TiptapNode {
  type: string;
  text?: string;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  attrs?: Record<string, string | number | boolean | null>;
}

// ---- Sanitize Seçenekleri ----
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

// ---- Mark uygulama ----
function applyMarks(text: string, marks: TiptapMark[]): string {
  let result = text;
  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        result = `<strong>${result}</strong>`;
        break;
      case "italic":
        result = `<em>${result}</em>`;
        break;
      case "underline":
        result = `<u>${result}</u>`;
        break;
      case "strike":
        result = `<s>${result}</s>`;
        break;
      case "code":
        result = `<code>${result}</code>`;
        break;
      case "link": {
        const href = mark.attrs?.href ?? "";
        const target = mark.attrs?.target ? ` target="${mark.attrs.target}"` : "";
        const rel = mark.attrs?.rel ? ` rel="${mark.attrs.rel}"` : ' rel="noopener noreferrer"';
        result = `<a href="${href}"${target}${rel}>${result}</a>`;
        break;
      }
    }
  }
  return result;
}

// ---- Tek node render ----
function renderNode(node: TiptapNode): string {
  if (node.type === "text") {
    const escaped = (node.text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return node.marks ? applyMarks(escaped, node.marks) : escaped;
  }

  const inner = (node.content ?? []).map(renderNode).join("");

  switch (node.type) {
    case "doc":
      return inner;
    case "paragraph":
      return inner ? `<p>${inner}</p>` : "<p><br></p>";
    case "heading": {
      const level = node.attrs?.level ?? 2;
      return `<h${level}>${inner}</h${level}>`;
    }
    case "blockquote":
      return `<blockquote>${inner}</blockquote>`;
    case "codeBlock": {
      const lang = node.attrs?.language ? ` class="language-${node.attrs.language}"` : "";
      return `<pre><code${lang}>${inner}</code></pre>`;
    }
    case "bulletList":
      return `<ul>${inner}</ul>`;
    case "orderedList":
      return `<ol>${inner}</ol>`;
    case "listItem":
      return `<li>${inner}</li>`;
    case "horizontalRule":
      return "<hr>";
    case "hardBreak":
      return "<br>";
    case "image": {
      const src = node.attrs?.src ?? "";
      const alt = node.attrs?.alt ?? "";
      const title = node.attrs?.title ? ` title="${node.attrs.title}"` : "";
      return `<img src="${src}" alt="${alt}"${title}>`;
    }
    default:
      return inner;
  }
}

/**
 * Tiptap JSON veya ham HTML içeriğini sanitize edilmiş HTML döndürür.
 * @param content - Tiptap JSON string veya ham HTML string
 */
export function renderRichText(content: string): string {
  if (!content) return "";

  // Tiptap JSON kontrolü
  try {
    const json = JSON.parse(content) as TiptapNode;
    if (json.type === "doc" && Array.isArray(json.content)) {
      const raw = renderNode(json);
      return sanitizeHtml(raw, SANITIZE_OPTIONS);
    }
  } catch {
    // JSON değil, ham HTML olarak işle
  }

  // Ham HTML → sanitize et
  return sanitizeHtml(content, SANITIZE_OPTIONS);
}
