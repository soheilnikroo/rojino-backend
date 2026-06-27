import { encodeQuery } from "../../config.js";
import { fetchJson } from "../../lib/http.js";
import { curatedHex, normalizeHex } from "../../lib/product/curated-colors.js";
import {
  cleanName,
  extractLongevity,
  extractStyle,
  inferAttributes,
  inferFinish,
  isLipProduct,
  splitShadeCode,
} from "../../lib/product/parser.js";
import { imageColorCache } from "../../services/image-color-cache.js";
import type { CatalogItem } from "../../types/catalog.js";
import {
  getBrandName,
  getMainImageUrl,
  getProductTitle,
  getProductUrl,
  getRating,
  getSellingPriceRial,
  rialToToman,
  type DigikalaSearchResponse,
} from "./types.js";

export async function digikalaCatalog(
  query: string,
  page = 1,
): Promise<CatalogItem[]> {
  const url = `https://api.digikala.com/v1/search/?q=${encodeQuery(query)}&page=${page}`;
  const data = await fetchJson<DigikalaSearchResponse>(url);
  const products = (data.data?.products ?? []).slice(0, 30);

  const tasks = products.map(async (product): Promise<CatalogItem | null> => {
    const titleFa = getProductTitle(product);
    if (!isLipProduct(titleFa)) return null;

    const brand = getBrandName(product);
    const color = product.default_variant?.color;
    const parsed = splitShadeCode(color?.title || cleanName(titleFa, brand));
    const shadeName = parsed.name || color?.title || brand || "رژ لب";
    const image = getMainImageUrl(product);

    const hex =
      curatedHex(brand, `${titleFa} ${shadeName}`) ??
      normalizeHex(color?.hex_code) ??
      (await imageColorCache.getHexFromImage(image));

    if (!hex) return null;

    const { rating, count } = getRating(product);
    const combinedText = `${titleFa} ${shadeName}`;

    return {
      id: `dk-${product.id}`,
      brand,
      shadeName,
      descFa: shadeName,
      hex,
      priceToman: rialToToman(getSellingPriceRial(product)),
      rating,
      ratingCount: count,
      url: getProductUrl(product),
      imageURL: image,
      finish: inferFinish(combinedText),
      styleFa: extractStyle(titleFa),
      longevityFa: extractLongevity(titleFa),
      code: parsed.code,
      attributes: inferAttributes(titleFa),
    };
  });

  return (await Promise.all(tasks)).filter(
    (item): item is CatalogItem => item !== null,
  );
}
