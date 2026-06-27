import { describe, expect, it } from "vitest";
import { encodeQuery, parseConfig } from "./config.js";

describe("parseConfig", () => {
  it("uses defaults when env vars are missing", () => {
    expect(parseConfig({})).toEqual({
      PORT: 3000,
      PROVIDER: "digikala",
    });
  });

  it("parses PORT and PROVIDER from env", () => {
    expect(
      parseConfig({
        PORT: "4000",
        PROVIDER: "mock",
      }),
    ).toEqual({
      PORT: 4000,
      PROVIDER: "mock",
    });
  });

  it("rejects invalid provider values", () => {
    expect(() =>
      parseConfig({
        PROVIDER: "amazon",
      }),
    ).toThrow();
  });

  it("rejects non-positive ports", () => {
    expect(() =>
      parseConfig({
        PORT: "0",
      }),
    ).toThrow();
  });
});

describe("encodeQuery", () => {
  it("encodes unicode search terms", () => {
    expect(encodeQuery("رژ لب")).toBe(encodeURIComponent("رژ لب"));
  });
});
