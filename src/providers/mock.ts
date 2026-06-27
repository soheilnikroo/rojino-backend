import { encodeQuery } from "../config.js";
import type { SearchResult } from "../types/search.js";

interface MockStore {
  retailer: string;
  base: string;
  price: number;
  rating: number;
  count: number;
}

const STORES: readonly MockStore[] = [
  { retailer: "ترب", base: "https://torob.com/search/?query=", price: 245000, rating: 4.6, count: 1280 },
  { retailer: "دیجی‌کالا", base: "https://www.digikala.com/search/?q=", price: 268000, rating: 4.7, count: 940 },
  { retailer: "دیجی‌استایل", base: "https://www.digistyle.com/search/?q=", price: 252000, rating: 4.4, count: 512 },
  { retailer: "خانومی", base: "https://khanoumi.com/search?q=", price: 261000, rating: 4.5, count: 680 },
  { retailer: "باسلام", base: "https://basalam.com/search?q=", price: 239000, rating: 4.3, count: 360 },
];

export function mockSearch(query: string): SearchResult[] {
  return STORES.map((store) => ({
    retailer: store.retailer,
    title: null,
    priceToman: store.price,
    rating: store.rating,
    ratingCount: store.count,
    url: store.base + encodeQuery(query),
    imageURL: null,
  }));
}
