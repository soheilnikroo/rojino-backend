import { describe, expect, it } from "vitest";
import { dominantVividColor, rgbToHsv } from "./color-math.js";
import { repeatPixel } from "../../test/helpers.js";

describe("rgbToHsv", () => {
  it("converts pure red", () => {
    const [h, s, v] = rgbToHsv(255, 0, 0);
    expect(h).toBeCloseTo(0, 0);
    expect(s).toBeCloseTo(1, 2);
    expect(v).toBeCloseTo(1, 2);
  });

  it("converts gray to zero saturation", () => {
    const [, s] = rgbToHsv(128, 128, 128);
    expect(s).toBe(0);
  });
});

describe("dominantVividColor", () => {
  it("returns averaged hex for enough vivid lip-tone pixels", () => {
    const buffer = repeatPixel([200, 30, 40, 255], 12);
    expect(dominantVividColor(buffer)).toBe("C81E28");
  });

  it("ignores low-alpha pixels", () => {
    const buffer = repeatPixel([200, 30, 40, 50], 12);
    expect(dominantVividColor(buffer)).toBeNull();
  });

  it("ignores desaturated packaging pixels", () => {
    const buffer = repeatPixel([220, 220, 220, 255], 12);
    expect(dominantVividColor(buffer)).toBeNull();
  });

  it("ignores blue/green hues", () => {
    const buffer = repeatPixel([20, 120, 200, 255], 12);
    expect(dominantVividColor(buffer)).toBeNull();
  });

  it("returns null when too few qualifying pixels", () => {
    const buffer = repeatPixel([200, 30, 40, 255], 5);
    expect(dominantVividColor(buffer)).toBeNull();
  });
});
