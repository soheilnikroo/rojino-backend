import { Jimp } from "jimp";
import { dominantVividColor } from "./color-math.js";

export async function extractLipColor(buffer: Buffer): Promise<string | null> {
  try {
    const image = await Jimp.read(buffer);
    image.resize({ w: 64, h: 64 });
    return dominantVividColor(image.bitmap.data);
  } catch {
    return null;
  }
}
