import sharp from "sharp";
import path from "path";
import { randomBytes } from "crypto";
import fs from "fs/promises";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "./public/uploads";
const MAX_SIZE_MB = parseInt(process.env.MAX_UPLOAD_SIZE_MB ?? "10", 10);
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_DIMENSION = 2000;

type UploadCategory = "products" | "slider" | "general" | "blog" | "collections";

export const uploadService = {
  async processAndSave(
    buffer: Buffer,
    mimeType: string,
    category: UploadCategory,
  ): Promise<{ url: string }> {
    if (!ALLOWED_TYPES.includes(mimeType)) {
      throw new Error("Geçersiz dosya tipi. Sadece JPEG, PNG veya WebP kabul edilir.");
    }

    if (buffer.length > MAX_SIZE_BYTES) {
      throw new Error(`Dosya boyutu ${MAX_SIZE_MB}MB limitini aşıyor.`);
    }

    // WebP'ye çevir ve yeniden boyutlandır
    const webpBuffer = await sharp(buffer)
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    // Benzersiz dosya adı üret
    const filename = `${randomBytes(16).toString("hex")}.webp`;
    const categoryDir = path.join(UPLOAD_DIR, category);

    await fs.mkdir(categoryDir, { recursive: true });
    await fs.writeFile(path.join(categoryDir, filename), webpBuffer);

    return { url: `/uploads/${category}/${filename}` };
  },

  async delete(url: string): Promise<void> {
    // URL'den dosya yolunu çıkar: /uploads/products/xxx.webp
    const relativePath = url.replace(/^\//, "");
    const absolutePath = path.resolve(process.cwd(), "public", relativePath);

    // Path traversal koruması: çözümlenmiş yolun uploads/ altında kalmasını zorla
    const safeBase = path.resolve(process.cwd(), "public", "uploads");
    if (!absolutePath.startsWith(safeBase + path.sep)) {
      throw new Error("Geçersiz dosya yolu: uploads dizini dışına çıkılamaz.");
    }

    try {
      await fs.unlink(absolutePath);
    } catch {
      // Dosya yoksa sessizce devam et
    }
  },
};
