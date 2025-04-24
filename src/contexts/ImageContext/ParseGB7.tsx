type GB7Pixel = {
  gray: number; // Значение оттенка серого от 0 до 127
  masked: boolean; // true если пиксель замаскирован (только если маска включена)
};

interface GB7Info {
  width: number;
  height: number;
  version: number;
  hasMask: boolean;
  pixelDataOffset: number;
}

export function parseGB7Info(buffer: ArrayBuffer): GB7Info | null {
  const view = new DataView(buffer);

  // Проверка сигнатуры
  const signature = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3),
  );
  if (signature !== "GB7\u001D") {
    console.error("Invalid GB7 signature");
    return null;
  }

  const version = view.getUint8(4);
  if (version !== 0x01) {
    console.error("Unsupported GB7 version:", version);
    return null;
  }

  const flags = view.getUint8(5);
  const hasMask = (flags & 0b00000001) === 1;

  const width = view.getUint16(6, false); // BE (big-endian)
  const height = view.getUint16(8, false); // BE

  // Зарезервированные байты (10-11) — пока не читаем, можно логировать
  const reserved = view.getUint16(10, false);
  if (reserved !== 0) {
    console.warn("Non-zero reserved bytes:", reserved);
  }

  return {
    width,
    height,
    version,
    hasMask,
    pixelDataOffset: 12,
  };
}

export function parseGB7Pixels(buffer: ArrayBuffer): GB7Pixel[][] | null {
  const info = parseGB7Info(buffer);
  if (!info) return null;

  const view = new DataView(buffer);
  const pixels: GB7Pixel[][] = [];

  const { width, height, hasMask, pixelDataOffset } = info;
  let offset = pixelDataOffset;

  for (let y = 0; y < height; y++) {
    const row: GB7Pixel[] = [];
    for (let x = 0; x < width; x++) {
      const byte = view.getUint8(offset++);
      const gray = byte & 0b01111111; // 7 младших битов
      const masked = hasMask ? (byte & 0b10000000) === 0 : false; // старший бит — 0 => замаскирован
      row.push({ gray, masked });
    }
    pixels.push(row);
  }

  return pixels;
}
