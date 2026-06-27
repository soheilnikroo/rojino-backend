import { afterEach, describe, expect, it, vi } from "vitest";
import { torobSearch } from "./torob.js";

vi.mock("../lib/http.js", () => ({
  fetchJson: vi.fn(),
}));

import { fetchJson } from "../lib/http.js";

const mockedFetchJson = vi.mocked(fetchJson);

describe("torobSearch", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("maps Torob results into search items", async () => {
    mockedFetchJson.mockResolvedValue({
      results: [
        {
          shop_text: "فروشگاه نمونه",
          name1: "رژ لب",
          price: 250_000,
          rating: 4.5,
          rating_count: 120,
          web_client_absolute_url: "/p/123",
          image_url: "https://example.com/torob.jpg",
        },
      ],
    });

    const results = await torobSearch("رژ لب");

    expect(results).toEqual([
      {
        retailer: "فروشگاه نمونه",
        title: "رژ لب",
        priceToman: 250_000,
        rating: 4.5,
        ratingCount: 120,
        url: "https://torob.com/p/123",
        imageURL: "https://example.com/torob.jpg",
      },
    ]);
  });

  it("falls back to Torob search URL when item link is missing", async () => {
    mockedFetchJson.mockResolvedValue({
      results: [{ name: "رژ لب", price: 100_000 }],
    });

    const results = await torobSearch("رژ لب");
    expect(results[0]?.url).toContain("https://torob.com/search/?query=");
  });
});
