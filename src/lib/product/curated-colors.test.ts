import { describe, expect, it } from "vitest";
import { curatedHex, normalizeHex } from "./curated-colors.js";

describe("normalizeHex", () => {
  it("strips hash and uppercases valid hex", () => {
    expect(normalizeHex("#c5172e")).toBe("C5172E");
  });

  it("returns null for invalid values", () => {
    expect(normalizeHex("red")).toBeNull();
    expect(normalizeHex(null)).toBeNull();
    expect(normalizeHex("ABC")).toBeNull();
  });
});

describe("curatedHex", () => {
  it("matches famous shades by brand and shade keywords", () => {
    expect(curatedHex("MAC", "Ruby Woo")).toBe("C5172E");
    expect(curatedHex("Dior", "Rouge 999")).toBe("D0021B");
  });

  it("returns null when no curated entry matches", () => {
    expect(curatedHex("Unknown Brand", "Shade X")).toBeNull();
  });
});
