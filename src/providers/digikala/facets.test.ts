import { afterEach, describe, expect, it, vi } from "vitest";
import { digikalaFacets } from "./facets.js";
import { digikalaSearchResponse, lipDigikalaProduct } from "../../test/helpers.js";

vi.mock("../../lib/http.js", () => ({
  fetchJson: vi.fn(),
}));

import { fetchJson } from "../../lib/http.js";

const mockedFetchJson = vi.mocked(fetchJson);

describe("digikalaFacets", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("aggregates facet counts across fetched pages", async () => {
    mockedFetchJson
      .mockResolvedValueOnce(digikalaSearchResponse([lipDigikalaProduct]))
      .mockResolvedValueOnce(digikalaSearchResponse([]));

    const facets = await digikalaFacets("رژ لب");

    expect(facets.brands).toEqual([
      { value: "MAC", label: "MAC", count: 1 },
    ]);
    expect(facets.colors).toEqual([
      { value: "Ruby Woo 01", label: "Ruby Woo 01", count: 1 },
    ]);
    expect(facets.longevity).toEqual([
      { value: "۲۴ ساعت", label: "۲۴ ساعت", count: 1 },
    ]);
    expect(facets.specs).toEqual([
      { value: "longWear", label: "longWear", count: 1 },
    ]);
    expect(mockedFetchJson).toHaveBeenCalledTimes(2);
  });
});
