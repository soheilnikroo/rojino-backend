import type { DigikalaProduct, DigikalaSearchResponse } from "../providers/digikala/types.js";

export const lipDigikalaProduct: DigikalaProduct = {
  id: 12345,
  title_fa: "رژ لب مات MAC Ruby Woo ماندگار ۲۴ ساعت",
  brand: { title_en: "MAC", title_fa: "مک" },
  default_variant: {
    color: { title: "Ruby Woo 01", hex_code: "#C5172E" },
    price: { selling_price: 2_680_000 },
  },
  rating: { rate: 94, count: 940 },
  images: { main: { url: ["https://example.com/lipstick.jpg"] } },
};

export const nonLipDigikalaProduct: DigikalaProduct = {
  id: 99999,
  title_fa: "براش آرایش صورت",
  brand: { title_en: "Generic" },
  default_variant: {
    price: { selling_price: 500_000 },
  },
};

export function digikalaSearchResponse(
  products: DigikalaProduct[] = [lipDigikalaProduct],
): DigikalaSearchResponse {
  return { data: { products } };
}

export interface MockFetchOptions {
  ok?: boolean;
  status?: number;
  body?: unknown;
  text?: string;
  arrayBuffer?: ArrayBuffer;
}

export function createFetchResponse(options: MockFetchOptions = {}) {
  const body = options.body ?? {};
  const text = options.text ?? JSON.stringify(body);

  return {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    json: async () => body,
    text: async () => text,
    arrayBuffer: async () => options.arrayBuffer ?? new TextEncoder().encode(text).buffer,
  };
}

export function rgbaBuffer(pixels: ReadonlyArray<readonly [number, number, number, number]>): Buffer {
  const buffer = Buffer.alloc(pixels.length * 4);
  for (let index = 0; index < pixels.length; index++) {
    const [r, g, b, a] = pixels[index]!;
    const offset = index * 4;
    buffer[offset] = r;
    buffer[offset + 1] = g;
    buffer[offset + 2] = b;
    buffer[offset + 3] = a;
  }
  return buffer;
}

export function repeatPixel(
  pixel: readonly [number, number, number, number],
  count: number,
): Buffer {
  return rgbaBuffer(Array.from({ length: count }, () => pixel));
}
