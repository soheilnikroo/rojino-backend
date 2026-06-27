const CURATED: ReadonlyArray<readonly [readonly string[], string]> = [
  [["dior", "999"], "D0021B"],
  [["mac", "ruby"], "C5172E"],
  [["mac", "chili"], "A0412E"],
  [["mac", "diva"], "7A1E2B"],
  [["mac", "velvet teddy"], "A5736A"],
  [["charlotte", "pillow"], "C08379"],
  [["nars", "dragon"], "D11F2D"],
  [["fenty", "stunna"], "C8102E"],
  [["ysl", "1966"], "C21731"],
];

export function normalizeHex(hex: string | null | undefined): string | null {
  if (!hex) return null;
  const stripped = String(hex).replace("#", "").trim();
  return /^[0-9A-Fa-f]{6}$/.test(stripped) ? stripped.toUpperCase() : null;
}

export function curatedHex(brand: string, shade: string): string | null {
  const haystack = `${brand} ${shade}`.toLowerCase();
  for (const [keys, hex] of CURATED) {
    if (keys.every((key) => haystack.includes(key))) return hex;
  }
  return null;
}
