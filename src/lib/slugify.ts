import slugifyLib from "slugify";

export function generateSlug(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: "tr",
    trim: true,
  });
}

/**
 * Slug çakışırsa sonuna -2, -3 ... ekler.
 */
export async function generateUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const slug = generateSlug(base);
  let candidate = slug;
  let i = 2;
  while (await exists(candidate)) {
    candidate = `${slug}-${i}`;
    i++;
  }
  return candidate;
}
