import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import {
  createFetchResponse,
  digikalaSearchResponse,
  lipDigikalaProduct,
} from "./test/helpers.js";

const configState = vi.hoisted(() => ({
  PROVIDER: "mock" as "mock" | "digikala" | "torob",
}));

vi.mock("./config.js", async () => {
  const actual = await vi.importActual<typeof import("./config.js")>("./config.js");
  return {
    ...actual,
    get config() {
      return {
        PORT: 3000,
        PROVIDER: configState.PROVIDER,
      };
    },
  };
});

describe("HTTP API", () => {
  beforeEach(() => {
    configState.PROVIDER = "mock";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("GET /health returns provider status", async () => {
    const response = await request(createApp()).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, provider: "mock" });
  });

  it("GET /search returns empty array for blank query", async () => {
    const response = await request(createApp()).get("/search?q=");
    expect(response.body).toEqual([]);
  });

  it("GET /search returns mock retailers when provider is mock", async () => {
    const response = await request(createApp()).get("/search").query({ q: "test" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
    expect(response.body[0]).toMatchObject({
      retailer: "ترب",
      priceToman: 245_000,
    });
  });

  it("GET /search falls back to mock results when digikala fails", async () => {
    configState.PROVIDER = "digikala";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(createFetchResponse({ ok: false, status: 500 })),
    );

    const response = await request(createApp()).get("/search").query({ q: "رژ لب" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
    expect(response.body[0].retailer).toBe("ترب");
  });

  it("GET /catalog returns mapped catalog items", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(createFetchResponse({ body: digikalaSearchResponse() })),
    );

    const response = await request(createApp()).get("/catalog").query({ q: "رژ لب" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      brand: "MAC",
      hex: "C5172E",
    });
  });

  it("GET /catalog returns empty array on upstream failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(createFetchResponse({ ok: false, status: 502 })),
    );

    const response = await request(createApp()).get("/catalog");
    expect(response.body).toEqual([]);
  });

  it("GET /facets returns aggregated facet buckets", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(createFetchResponse({ body: digikalaSearchResponse() }))
        .mockResolvedValueOnce(createFetchResponse({ body: digikalaSearchResponse([]) })),
    );

    const response = await request(createApp()).get("/facets").query({ q: "رژ لب" });

    expect(response.status).toBe(200);
    expect(response.body.brands[0]).toMatchObject({ value: "MAC", count: 1 });
    expect(response.body.colors[0]).toMatchObject({ value: "Ruby Woo 01", count: 1 });
  });

  it("GET /facets returns empty buckets on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(createFetchResponse({ ok: false, status: 500 })),
    );

    const response = await request(createApp()).get("/facets");
    expect(response.body).toEqual({
      brands: [],
      colors: [],
      specs: [],
      longevity: [],
    });
  });

  it("GET /raw proxies upstream JSON", async () => {
    const upstream = digikalaSearchResponse([lipDigikalaProduct]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(createFetchResponse({ body: upstream })),
    );

    const response = await request(createApp()).get("/raw").query({ q: "رژ لب" });

    expect(response.status).toBe(200);
    expect(response.body.data.products).toHaveLength(1);
  });

  it("GET /raw returns 502 when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const response = await request(createApp()).get("/raw").query({ q: "رژ لب" });

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: "network down" });
  });
});
