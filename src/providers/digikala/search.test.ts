import { afterEach, describe, expect, it, vi } from "vitest";
import { digikalaSearch } from "./search.js";
import {
  digikalaSearchResponse,
  lipDigikalaProduct,
  nonLipDigikalaProduct,
} from "../../test/helpers.js";

vi.mock("../../lib/http.js", () => ({
  fetchJson: vi.fn(),
}));

import { fetchJson } from "../../lib/http.js";

const mockedFetchJson = vi.mocked(fetchJson);

describe("digikalaSearch", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("maps lip products and filters unrelated items", async () => {
    mockedFetchJson.mockResolvedValue(
      digikalaSearchResponse([lipDigikalaProduct, nonLipDigikalaProduct]),
    );

    const results = await digikalaSearch("رژ لب");

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      retailer: "دیجی‌کالا",
      title: lipDigikalaProduct.title_fa,
      priceToman: 268_000,
      rating: 4.7,
      ratingCount: 940,
      url: "https://www.digikala.com/product/dkp-12345/",
      imageURL: "https://example.com/lipstick.jpg",
    });
  });

  it("drops products with zero price", async () => {
    mockedFetchJson.mockResolvedValue(
      digikalaSearchResponse([
        {
          ...lipDigikalaProduct,
          default_variant: { price: { selling_price: 0 } },
        },
      ]),
    );

    await expect(digikalaSearch("رژ لب")).resolves.toEqual([]);
  });
});
