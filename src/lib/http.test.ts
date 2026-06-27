import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchBuffer, fetchJson } from "./http.js";
import { createFetchResponse } from "../test/helpers.js";

describe("fetchJson", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed JSON for successful responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(createFetchResponse({ body: { ok: true } })),
    );

    await expect(fetchJson<{ ok: boolean }>("https://example.com/api")).resolves.toEqual({
      ok: true,
    });
  });

  it("throws on non-OK responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(createFetchResponse({ ok: false, status: 500, body: {} })),
    );

    await expect(fetchJson("https://example.com/api")).rejects.toThrow("HTTP 500");
  });
});

describe("fetchBuffer", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a buffer for successful responses", async () => {
    const payload = new TextEncoder().encode("image").buffer;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(createFetchResponse({ arrayBuffer: payload })),
    );

    const buffer = await fetchBuffer("https://example.com/image.jpg");
    expect(buffer?.toString()).toBe("image");
  });

  it("returns null for failed responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(createFetchResponse({ ok: false, status: 404 })),
    );

    await expect(fetchBuffer("https://example.com/missing.jpg")).resolves.toBeNull();
  });
});
