import { describe, expect, it } from "vitest";
import {
  cleanName,
  extractLongevity,
  extractStyle,
  inferAttributes,
  inferFinish,
  isLipProduct,
  splitShadeCode,
} from "./parser.js";

describe("isLipProduct", () => {
  it("accepts lipstick titles", () => {
    expect(isLipProduct("رژ لب مات MAC")).toBe(true);
    expect(isLipProduct("lipstick matte red")).toBe(true);
  });

  it("rejects unrelated products", () => {
    expect(isLipProduct("براش آرایش")).toBe(false);
    expect(isLipProduct("پاک کننده رژ لب")).toBe(false);
    expect(isLipProduct("")).toBe(false);
  });
});

describe("inferFinish", () => {
  it.each([
    ["رژ لب مات", "matte"],
    ["velvet lipstick", "velvet"],
    ["gloss finish", "gloss"],
    ["satin lip", "satin"],
    ["metallic red", "metallic"],
    ["glitter party", "glitter"],
    ["shimmer glow", "shimmer"],
    ["sheer tint", "sheer"],
    ["long wear stain", "stain"],
  ] as const)("detects %s as %s", (text, finish) => {
    expect(inferFinish(text)).toBe(finish);
  });

  it("returns null when finish is unknown", () => {
    expect(inferFinish("رژ لب کلاسیک")).toBeNull();
  });
});

describe("inferAttributes", () => {
  it("collects multiple product attributes", () => {
    expect(inferAttributes("رژ لب ضد آب وگان ماندگار")).toEqual([
      "waterproof",
      "longWear",
      "vegan",
    ]);
  });
});

describe("extractStyle", () => {
  it("returns the first matching Persian style word", () => {
    expect(extractStyle("رژ لب مایع مات")).toBe("مایع");
  });
});

describe("extractLongevity", () => {
  it("maps hour counts to Persian buckets", () => {
    expect(extractLongevity("ماندگاری ۸ ساعت")).toBe("۸ ساعت");
    expect(extractLongevity("ماندگاری ۱۶ ساعت")).toBe("۱۲ ساعت");
    expect(extractLongevity("ماندگاری ۳۰ ساعت")).toBe("۲۴ ساعت");
    expect(extractLongevity("ماندگاری ۱۰۰ ساعت")).toBe("۹۶ ساعت");
  });

  it("returns null when hours are absent", () => {
    expect(extractLongevity("رژ لب مات")).toBeNull();
  });
});

describe("cleanName", () => {
  it("removes lipstick boilerplate and brand name", () => {
    expect(cleanName("رژ لب مات MAC Ruby Woo", "MAC")).toBe("Ruby Woo");
  });
});

describe("splitShadeCode", () => {
  it("separates shade name from numeric or code tokens", () => {
    expect(splitShadeCode("Ruby Woo 01")).toEqual({
      name: "Ruby Woo",
      code: "01",
    });
  });

  it("skips the Persian color prefix token", () => {
    expect(splitShadeCode("رنگ 999")).toEqual({
      name: "",
      code: "999",
    });
  });
});
