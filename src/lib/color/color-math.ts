export type Rgb = readonly [number, number, number];
export type Hsv = readonly [number, number, number];

export function rgbToHsv(r: number, g: number, b: number): Hsv {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return [h, max === 0 ? 0 : delta / max, max];
}

function toHex(r: number, g: number, b: number): string {
  return [r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

export function dominantVividColor(data: Uint8Array | Buffer): string | null {
  let rs = 0;
  let gs = 0;
  let bs = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const alpha = data[i + 3]!;

    if (alpha < 128) continue;

    const [h, s, v] = rgbToHsv(r, g, b);
    if (s < 0.25) continue;
    if (v < 0.12 || v > 0.97) continue;

    const lipHue = h <= 50 || h >= 300;
    if (!lipHue) continue;

    rs += r;
    gs += g;
    bs += b;
    count++;
  }

  if (count < 8) return null;
  return toHex(rs / count, gs / count, bs / count);
}
