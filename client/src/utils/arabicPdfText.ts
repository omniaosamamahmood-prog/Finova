/**
 * Prepare Arabic strings for jsPDF.
 *
 * jsPDF cannot apply OpenType Arabic shaping. We must:
 * 1. Convert to Unicode Presentation Forms (connected glyphs)
 * 2. Reverse for visual order because jsPDF paints left-to-right
 *
 * Do not enable doc.setR2L() when using this helper — that double-flips text.
 */
import reshaper from "arabic-persian-reshaper";

const ArabicShaper = reshaper.ArabicShaper;

const ARABIC_RE =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

export function containsArabic(text: string): boolean {
  return ARABIC_RE.test(text);
}

export function reshapeArabic(text: string): string {
  if (!text || !containsArabic(text)) return text;
  return ArabicShaper.convertArabic(text);
}

/**
 * Returns text ready to draw with jsPDF (LTR engine + align right for RTL UI).
 */
export function preparePdfText(text: string, _rtl = true): string {
  if (!text) return text;
  if (!containsArabic(text)) return text;

  const shaped = reshapeArabic(text);
  return Array.from(shaped).reverse().join("");
}
