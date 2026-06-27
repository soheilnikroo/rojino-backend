import { afterEach, describe, expect, it, vi } from "vitest";
import { digikalaCatalog } from "./catalog.js";
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

describe("digikalaCatalog", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("builds catalog items from lip products with curated hex", async () => {
    mockedFetchJson.mockResolvedValue(
      digikalaSearchResponse([lipDigikalaProduct, nonLipDigikalaProduct]),
    );

    const items = await digikalaCatalog("رژ لب");

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: "dk-12345",
      brand: "MAC",
      shadeName: "Ruby Woo",
      hex: "C5172E",
      priceToman: 268_000,
      finish: "matte",
      styleFa: "مات",
      longevityFa: "۲۴ ساعت",
      code: "01",
      attributes: ["longWear"],
    });
  });

  it("skips products without a resolvable color", async () => {
    mockedFetchJson.mockResolvedValue(
      digikalaSearchResponse([
        {
          ...lipDigikalaProduct,
          title_fa: "رژ لب ناشناخته",
          brand: { title_en: "Unknown" },
          default_variant: {
            color: { title: "Mystery" },
            price: { selling_price: 1_000_000 },
          },
        },
      ]),
    );

    await expect(digikalaCatalog("رژ لب")).resolves.toEqual([]);
  });
});
