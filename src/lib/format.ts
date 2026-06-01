const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

/** Convert a number to Arabic-Indic numerals (e.g. 42 → ٤٢). */
export function toArabicNumerals(n: number): string {
  return String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)])
}
