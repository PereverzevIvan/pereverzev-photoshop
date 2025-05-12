import React, { createContext, useEffect, useState } from "react";
import { detectImageFormat } from "../../utils/ImageTypeGetter";
import { loadGB7Image, loadStandardImage } from "../../utils/loadImage";
import { getColorDepthOfImage } from "../../utils/ColorDepthGetter";
import { resizeImageByMethod } from "../../utils/resize";
import { findClosestScaleBelow, scaleImage } from "../../utils/scaleImage";

export type ImageContextProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null> | null;
  setCanvasRef: (ref: React.RefObject<HTMLCanvasElement | null> | null) => void;

  imageData: ImageData | null;
  width: number;
  height: number;
  colorDepth: number;
  scaleValue: number;
  setScaleValue: (value: number) => void;
  renderMethod: "normal" | "pixelated";
  setRenderMethod: (method: "normal" | "pixelated") => void;

  loadImage: (file: File) => void;
  clearImage: () => void;
  resizeImage: (
    newWidth: number,
    newHeight: number,
    method: "nearest" | "bilinear",
  ) => void;
  drawImageOnCanvas: (data: ImageData) => void;
};

const defaultContext: ImageContextProps = {
  canvasRef: null,
  setCanvasRef: () => {},

  imageData: null,
  width: 0,
  height: 0,
  colorDepth: 0,
  scaleValue: 1,
  setScaleValue: () => {},
  renderMethod: "normal",
  setRenderMethod: () => {},

  loadImage: () => {},
  clearImage: () => {},
  resizeImage: () => {},
  drawImageOnCanvas: () => {},
};

export const ImageContext = createContext<ImageContextProps>(defaultContext);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [canvasRef, setCanvasRef] =
    useState<React.RefObject<HTMLCanvasElement | null> | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [colorDepth, setColorDepth] = useState(0);
  const [scaleValue, setScaleValue] = useState(1);
  const [renderMethod, setRenderMethod] = useState<"normal" | "pixelated">(
    "normal",
  );

  // Очистка изображения
  function clearImage() {
    const canvas = canvasRef?.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

      setImageData(null);
      setWidth(0);
      setHeight(0);
      setColorDepth(0);
    } else {
      alert("Canvas не найден");
    }
  }

  // Загрузка изображения
  async function loadImage(file: File) {
    let fileType = "";

    try {
      fileType = await detectImageFormat(file);
    } catch (error) {
      alert("Произошла ошибка при загрузке изображения: " + error);
      return;
    }

    let newImageData: ImageData | null = null;

    if (fileType === "png" || fileType === "jpeg")
      newImageData = await loadStandardImage(file);
    else if (fileType === "graybit-7") newImageData = await loadGB7Image(file);
    else {
      alert("Неподдерживаемый формат изображения");
      return;
    }

    if (!newImageData) {
      alert("Не удалось загрузить изображение");
      return;
    }

    const canvas = canvasRef?.current;
    if (!canvas) {
      alert("Canvas не найден");
      return;
    }

    const closestScale = findClosestScaleBelow(
      canvas.width,
      canvas.height,
      newImageData.width,
      newImageData.height,
    );

    setScaleValue(closestScale);
    setImageData(newImageData);
    setWidth(newImageData.width);
    setHeight(newImageData.height);

    const depth = await getColorDepthOfImage(file, fileType);
    if (depth) setColorDepth(depth);
  }

  // Изменение размера изображения
  async function resizeImage(
    newWidth: number,
    newHeight: number,
    method: "nearest" | "bilinear",
  ) {
    const newImageData = await resizeImageByMethod(
      imageData,
      newWidth,
      newHeight,
      method,
    );

    if (!newImageData) {
      alert("Не удалось изменить размер изображения");
      return;
    }

    setImageData(newImageData);
    setWidth(newImageData.width);
    setHeight(newImageData.height);
  }

  async function drawImageOnCanvas(data: ImageData) {
    const canvas = canvasRef?.current;

    if (canvas) {
      const scale = await scaleImage({
        canvas,
        imageData: data,
        scale: scaleValue,
      });
      console.log(scale);

      if (!scale) {
        alert("Не удалось изменить размер изображения");
        return;
      }

      // canvas.width = scale.newCanvasWidth;
      // canvas.height = scale.newCanvasHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(
          scale.scaledImageData,
          scale.imageOffsetX,
          scale.imageOffsetY,
        );
      }
    } else {
      alert("Canvas не найден");
    }
  }

  useEffect(() => {
    if (imageData) {
      drawImageOnCanvas(imageData);
    }
  }, [imageData, scaleValue]);

  return (
    <ImageContext.Provider
      value={{
        canvasRef,
        setCanvasRef,
        imageData,
        width,
        height,
        scaleValue,
        setScaleValue,
        colorDepth,
        loadImage,
        renderMethod,
        setRenderMethod,
        clearImage,
        resizeImage,
        drawImageOnCanvas,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}
