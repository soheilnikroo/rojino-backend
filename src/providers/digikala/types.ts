export interface DigikalaBrand {
  title_en?: string;
  title_fa?: string;
  name?: string;
}

export interface DigikalaColor {
  title?: string;
  hex_code?: string;
}

export interface DigikalaPrice {
  selling_price?: number;
}

export interface DigikalaVariant {
  color?: DigikalaColor;
  price?: DigikalaPrice;
}

export interface DigikalaRating {
  rate?: number;
  count?: number;
}

export interface DigikalaImages {
  main?: {
    url?: string | string[];
  };
}

export interface DigikalaProduct {
  id?: number;
  product_id?: number;
  title?: string;
  title_fa?: string;
  brand?: DigikalaBrand;
  default_variant?: DigikalaVariant;
  product_price?: number;
  rating?: DigikalaRating;
  images?: DigikalaImages;
  url?: string | { uri?: string };
}

export interface DigikalaSearchResponse {
  data?: {
    products?: DigikalaProduct[];
  };
}

export function getProductTitle(product: DigikalaProduct): string {
  return (product.title_fa ?? product.title ?? "").trim();
}

export function getBrandName(product: DigikalaProduct): string {
  return (
    product.brand?.title_en ??
    product.brand?.title_fa ??
    product.brand?.name ??
    ""
  );
}

export function getSellingPriceRial(product: DigikalaProduct): number {
  return product.default_variant?.price?.selling_price ?? product.product_price ?? 0;
}

export function getRating(product: DigikalaProduct): { rating: number; count: number } {
  const ratePct = product.rating?.rate ?? 0;
  return {
    rating: Math.round((Number(ratePct) / 20) * 10) / 10,
    count: Number(product.rating?.count ?? 0),
  };
}

export function getMainImageUrl(product: DigikalaProduct): string | null {
  const url = product.images?.main?.url;
  if (Array.isArray(url)) return url[0] ?? null;
  return url ?? null;
}

export function getProductUrl(product: DigikalaProduct): string {
  const rawUrl = product.url;
  if (typeof rawUrl === "string") {
    if (rawUrl.startsWith("http")) return rawUrl;
    if (rawUrl.startsWith("/")) return `https://www.digikala.com${rawUrl}`;
  }

  const uri = typeof rawUrl === "object" ? rawUrl?.uri : undefined;
  if (typeof uri === "string") {
    if (uri.startsWith("http")) return uri;
    if (uri.startsWith("/")) return `https://www.digikala.com${uri}`;
  }

  const id = product.id ?? product.product_id;
  return id
    ? `https://www.digikala.com/product/dkp-${id}/`
    : "https://www.digikala.com/";
}

export function rialToToman(rial: number): number {
  return Math.round(Number(rial) / 10);
}
