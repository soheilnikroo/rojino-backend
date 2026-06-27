import { encodeQuery } from "../../config.js";
import { fetchJson } from "../../lib/http.js";
import type { SearchResult } from "../../types/search.js";
import { isLipProduct } from "../../lib/product/parser.js";
import {
  getMainImageUrl,
  getProductTitle,
  getProductUrl,
  getRating,
  getSellingPriceRial,
  rialToToman,
  type DigikalaSearchResponse,
} from "./types.js";

export async function digikalaSearch(query: string): Promise<SearchResult[]> {
  const url = `https://api.digikala.com/v1/search/?q=${encodeQuery(query)}&page=1`;
  const data = await fetchJson<DigikalaSearchResponse>(url);
  const products = (data.data?.products ?? []).filter((product) =>
    isLipProduct(getProductTitle(product)),
  );

  return products
    .slice(0, 15)
    .map((product) => {
      const { rating, count } = getRating(product);
      return {
        retailer: "دیجی‌کالا",
        title: product.title_fa ?? null,
        priceToman: rialToToman(getSellingPriceRial(product)),
        rating,
        ratingCount: count,
        url: getProductUrl(product),
        imageURL: getMainImageUrl(product),
      };
    })
    .filter((item) => item.priceToman > 0);
}
