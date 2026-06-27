import { encodeQuery } from "../../config.js";
import { fetchJson } from "../../lib/http.js";
import {
  extractLongevity,
  inferAttributes,
  isLipProduct,
} from "../../lib/product/parser.js";
import type { FacetOption, Facets } from "../../types/catalog.js";
import {
  getBrandName,
  getProductTitle,
  type DigikalaProduct,
  type DigikalaSearchResponse,
} from "./types.js";

function countBy(values: Array<string | null | undefined>): FacetOption[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ value: label, label, count }));
}

async function fetchLipProducts(query: string, page: number): Promise<DigikalaProduct[]> {
  const url = `https://api.digikala.com/v1/search/?q=${encodeQuery(query)}&page=${page}`;
  const data = await fetchJson<DigikalaSearchResponse>(url);
  return (data.data?.products ?? []).filter((product) =>
    isLipProduct(getProductTitle(product)),
  );
}

export async function digikalaFacets(query: string): Promise<Facets> {
  const all: DigikalaProduct[] = [];

  for (const page of [1, 2, 3]) {
    const products = await fetchLipProducts(query, page);
    if (!products.length) break;
    all.push(...products);
  }

  return {
    brands: countBy(all.map((product) => getBrandName(product))),
    colors: countBy(all.map((product) => product.default_variant?.color?.title)),
    longevity: countBy(all.map((product) => extractLongevity(getProductTitle(product)))),
    specs: countBy(all.flatMap((product) => inferAttributes(getProductTitle(product)))),
  };
}
