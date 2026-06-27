import { encodeQuery } from "../config.js";
import { fetchJson } from "../lib/http.js";
import type { SearchResult } from "../types/search.js";

interface TorobResult {
  shop_text?: string;
  name1?: string;
  name2?: string;
  name?: string;
  price?: number;
  rating?: number;
  rating_count?: number;
  web_client_absolute_url?: string;
  more_info_url?: string;
  image_url?: string | null;
}

interface TorobSearchResponse {
  results?: TorobResult[];
}

export async function torobSearch(query: string): Promise<SearchResult[]> {
  const url = `https://api.torob.com/v4/base-product/search/?query=${encodeQuery(query)}&page=0`;
  const data = await fetchJson<TorobSearchResponse>(url);
  const results = Array.isArray(data.results) ? data.results : [];

  return results
    .slice(0, 15)
    .map((item) => {
      const relativeUrl = item.web_client_absolute_url || item.more_info_url || "";
      const link = relativeUrl
        ? relativeUrl.startsWith("http")
          ? relativeUrl
          : `https://torob.com${relativeUrl}`
        : `https://torob.com/search/?query=${encodeQuery(query)}`;

      return {
        retailer: item.shop_text || "ترب",
        title: item.name1 || item.name2 || item.name || null,
        priceToman: Number(item.price) || 0,
        rating: Number(item.rating) || 0,
        ratingCount: Number(item.rating_count) || 0,
        url: link,
        imageURL: item.image_url || null,
      };
    })
    .filter((item) => item.url);
}
