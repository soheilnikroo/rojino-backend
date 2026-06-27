import { afterEach, describe, expect, it, vi } from "vitest";
import { ImageColorCache } from "./image-color-cache.js";
import { repeatPixel } from "../test/helpers.js";

vi.mock("../lib/http.js", () => ({
  fetchBuffer: vi.fn(),
}));

vi.mock("../lib/color/extract-lip-color.js", () => ({
  extractLipColor: vi.fn(),
}));

import { extractLipColor } from "../lib/color/extract-lip-color.js";
import { fetchBuffer } from "../lib/http.js";

const mockedFetchBuffer = vi.mocked(fetchBuffer);
const mockedExtractLipColor = vi.mocked(extractLipColor);

describe("ImageColorCache", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns null for missing URLs", async () => {
    const cache = new ImageColorCache();
    await expect(cache.getHexFromImage(null)).resolves.toBeNull();
    expect(mockedFetchBuffer).not.toHaveBeenCalled();
  });

  it("caches extracted colors per image URL", async () => {
    const cache = new ImageColorCache();
    const imageUrl = "https://example.com/lip.jpg";
    const buffer = repeatPixel([200, 30, 40, 255], 12);

    mockedFetchBuffer.mockResolvedValue(buffer);
    mockedExtractLipColor.mockResolvedValue("C81E28");

    await expect(cache.getHexFromImage(imageUrl)).resolves.toBe("C81E28");
    await expect(cache.getHexFromImage(imageUrl)).resolves.toBe("C81E28");

    expect(mockedFetchBuffer).toHaveBeenCalledTimes(1);
    expect(mockedExtractLipColor).toHaveBeenCalledTimes(1);
  });
});
