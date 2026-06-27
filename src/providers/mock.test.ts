import { describe, expect, it } from "vitest";
import { mockSearch } from "./mock.js";

describe("mockSearch", () => {
  it("returns five retailer deep links with encoded query", () => {
    const results = mockSearch("رژ لب");

    expect(results).toHaveLength(5);
    expect(results[0]).toMatchObject({
      retailer: "ترب",
      title: null,
      imageURL: null,
      priceToman: 245_000,
    });
    expect(results[0]?.url).toContain(encodeURIComponent("رژ لب"));
  });
});
