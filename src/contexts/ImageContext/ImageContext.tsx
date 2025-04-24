import React, { createContext, useState } from "react";
import { detectImageFormat } from "./ImageTypeGetter";
import { parseGB7Pixels } from "./ParseGB7";
import { getColorDepthOfImage } from "./ColorDepthGetter";

export type ImageContextProps = {
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  setCanvasRef: (ref: React.RefObject<HTMLCanvasElement> | null) => void;

  width: number;
  height: number;
  colorDepth: number;

  loadImage: (file: File) => void;
};

const defaultContext: ImageContextProps = {
  canvasRef: null,
  setCanvasRef: () => {},

  width: 0,
  height: 0,
  colorDepth: 0,

  loadImage: () => {},
};

export const ImageContext = createContext<ImageContextProps>(defaultContext);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [canvasRef, setCanvasRef] =
    useState<React.RefObject<HTMLCanvasElement> | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [colorDepth, setColorDepth] = useState(0);

  // Загрузка изображения
  async function loadImage(file: File) {
    const fileType = await detectImageFormat(file);

    if (fileType === "png" || fileType === "jpeg") loadStandardImage(file);
    else if (fileType === "graybit-7") loadGB7Image(file);

    const depth = await getColorDepthOfImage(file, fileType);
    if (depth) setColorDepth(depth);
  }

  function loadStandardImage(file: File) {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef?.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0);

      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = URL.createObjectURL(file);
  }

  // Загрузка GB7-изображения
  async function loadGB7Image(file: File) {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const buffer = await file.arrayBuffer();
    const gb7Image = parseGB7Pixels(buffer);
    if (!gb7Image) {
      alert("Не удалось загрузить изображение. Ошибка формата.");
      return;
    }

    const imgWidth = gb7Image[0].length;
    const imgHeight = gb7Image.length;

    canvas.width = imgWidth;
    canvas.height = imgHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = new ImageData(imgWidth, imgHeight);
    const data = imageData.data;

    let i = 0;
    for (let y = 0; y < imgHeight; y++) {
      for (let x = 0; x < imgWidth; x++) {
        const { gray, masked } = gb7Image[y][x];
        const color = gray * 2; // 7-битный -> 8-битный (примерно)

        data[i++] = color; // R
        data[i++] = color; // G
        data[i++] = color; // B
        data[i++] = masked ? 0 : 255; // A: 0 если замаскирован, 255 иначе
      }
    }

    ctx.putImageData(imageData, 0, 0);

    setWidth(imgWidth);
    setHeight(imgHeight);
  }

  return (
    <ImageContext.Provider
      value={{
        canvasRef,
        setCanvasRef,
        width,
        height,
        colorDepth,
        loadImage,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}
