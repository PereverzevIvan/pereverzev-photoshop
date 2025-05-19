// RGB 0–255 → 0–1
export function srgbToLinear(value: number): number {
  const v = value / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

// RGB → XYZ
export function rgbToXyz([r, g, b]: number[]): number[] {
  r = srgbToLinear(r);
  g = srgbToLinear(g);
  b = srgbToLinear(b);

  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
  return [x * 100, y * 100, z * 100];
}

// XYZ → Lab
export function xyzToLab([x, y, z]: number[]): number[] {
  const X = x / 95.047;
  const Y = y / 100.0;
  const Z = z / 108.883;

  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);

  const fx = f(X);
  const fy = f(Y);
  const fz = f(Z);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);
  return [L, a, b];
}

// Lab → OKLch (упрощённо через Lab, реальный пересчёт через OKLab сложнее)
export function labToLch([L, a, b]: number[]): number[] {
  const C = Math.sqrt(a * a + b * b);
  const h = Math.atan2(b, a) * (180 / Math.PI);
  return [L, C, h < 0 ? h + 360 : h];
}

// WCAG контраст
export function getLuminance([r, g, b]: number[]): number {
  const [rl, gl, bl] = [r, g, b].map(srgbToLinear);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

export function getContrast(c1: number[], c2: number[]): number {
  const L1 = getLuminance(c1);
  const L2 = getLuminance(c2);
  return +(
    L1 > L2 ? (L1 + 0.05) / (L2 + 0.05) : (L2 + 0.05) / (L1 + 0.05)
  ).toFixed(2);
}
