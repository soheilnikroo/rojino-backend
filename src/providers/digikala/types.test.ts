import { describe, expect, it } from "vitest";
import {
  getBrandName,
  getMainImageUrl,
  getProductTitle,
  getProductUrl,
  getRating,
  getSellingPriceRial,
  rialToToman,
} from "./types.js";
import { lipDigikalaProduct } from "../../test/helpers.js";

describe("digikala product helpers", () => {
  it("reads title, brand, price, and rating", () => {
    expect(getProductTitle(lipDigikalaProduct)).toContain("رژ لب");
    expect(getBrandName(lipDigikalaProduct)).toBe("MAC");
    expect(getSellingPriceRial(lipDigikalaProduct)).toBe(2_680_000);
    expect(getRating(lipDigikalaProduct)).toEqual({ rating: 4.7, count: 940 });
    expect(rialToToman(2_680_000)).toBe(268_000);
  });

  it("resolves image and product URLs", () => {
    expect(getMainImageUrl(lipDigikalaProduct)).toBe("https://example.com/lipstick.jpg");
    expect(getProductUrl(lipDigikalaProduct)).toBe(
      "https://www.digikala.com/product/dkp-12345/",
    );
    expect(getProductUrl({ url: "/product/foo/" })).toBe(
      "https://www.digikala.com/product/foo/",
    );
    expect(getProductUrl({ url: { uri: "https://cdn.example.com/p" } })).toBe(
      "https://cdn.example.com/p",
    );
  });
});
