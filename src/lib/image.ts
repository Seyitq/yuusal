import sharp from "sharp";

/**
 * Görseli WebP formatına çevirir ve max boyuta küçültür.
 */
export async function convertToWebP(
  input: Buffer | string,
  options?: { maxWidth?: number; maxHeight?: number; quality?: number },
): Promise<Buffer> {
  const { maxWidth = 2000, maxHeight = 2000, quality = 85 } = options ?? {};

  return sharp(input)
    .resize(maxWidth, maxHeight, { fit: "inside", withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
}

/**
 * Görselden thumbnail üretir.
 */
export async function generateThumbnail(
  input: Buffer | string,
  size = 400,
): Promise<Buffer> {
  return sharp(input)
    .resize(size, size, { fit: "cover" })
    .webp({ quality: 80 })
    .toBuffer();
}
