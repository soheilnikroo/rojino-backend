import { extractLipColor } from "../lib/color/extract-lip-color.js";
import { fetchBuffer } from "../lib/http.js";

export class ImageColorCache {
  private readonly cache = new Map<string, string | null>();

  async getHexFromImage(url: string | null | undefined): Promise<string | null> {
    if (!url) return null;

    if (this.cache.has(url)) {
      return this.cache.get(url) ?? null;
    }

    let hex: string | null = null;
    try {
      const buffer = await fetchBuffer(url);
      if (buffer) hex = await extractLipColor(buffer);
    } catch {
      hex = null;
    }

    this.cache.set(url, hex);
    return hex;
  }
}

export const imageColorCache = new ImageColorCache();
