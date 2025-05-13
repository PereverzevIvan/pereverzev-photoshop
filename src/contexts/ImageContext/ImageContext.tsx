import React, { createContext, useContext, useEffect, useState } from "react";
import { detectImageFormat } from "../../utils/ImageTypeGetter";
import { loadGB7Image, loadStandardImage } from "../../utils/loadImage";
import { getColorDepthOfImage } from "../../utils/ColorDepthGetter";
import { resizeImageByMethod } from "../../utils/resize";
import { findClosestScaleBelow, scaleImage } from "../../utils/scaleImage";

export type ImageContextProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null> | null;
  setCanvasRef: (ref: React.RefObject<HTMLCanvasElement | null> | null) => void;

  imageData: ImageData | null;
  scalledImageData: ImageData | null;
  width: number;
  height: number;
  colorDepth: number;
  scaleValue: number;
  renderMethod: "normal" | "pixelated";
  offsetX: number;
  offsetY: number;
  setOffsetX: (value: React.SetStateAction<number>) => void;
  setOffsetY: (value: React.SetStateAction<number>) => void;
  setRenderMethod: (method: "normal" | "pixelated") => void;
  setScaleValue: (value: number) => void;

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
  scalledImageData: null,
  width: 0,
  height: 0,
  colorDepth: 0,
  scaleValue: 1,
  renderMethod: "normal",
  offsetX: 0,
  offsetY: 0,
  setOffsetX: () => {},
  setOffsetY: () => {},
  setRenderMethod: () => {},
  setScaleValue: () => {},

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
  const [scalledImageData, setScalledImageData] = useState<ImageData | null>(
    null,
  );
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
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
      setScalledImageData(null);
      setWidth(0);
      setHeight(0);
      setOffsetX(0);
      setOffsetY(0);
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

    const scale = await scaleImage({
      canvas,
      imageData: newImageData,
      scale: closestScale,
    });

    if (!scale.scaledImageData) {
      alert("Не удалось изменить размер изображения при загрузке");
      return;
    }

    setImageData(newImageData);
    setWidth(newImageData.width);
    setHeight(newImageData.height);
    setScaleValue(closestScale);

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

  async function drawImageOnCanvas(data: ImageData, offsetX = 0, offsetY = 0) {
    const canvas = canvasRef?.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(data, offsetX, offsetY);
      }
    } else {
      alert("Canvas не найден");
    }
  }

  useEffect(() => {
    async function scale() {
      if (!imageData) return;

      const canvas = canvasRef?.current;
      if (!canvas) return;

      const scale = await scaleImage({
        canvas: canvas,
        imageData: imageData,
        scale: scaleValue,
      });

      if (!scale) return;
      setScalledImageData(scale.scaledImageData);
      setOffsetX(scale.imageOffsetX);
      setOffsetY(scale.imageOffsetY);
    }

    scale();
  }, [imageData, scaleValue]);

  useEffect(() => {
    if (scalledImageData) {
      drawImageOnCanvas(scalledImageData, offsetX, offsetY);
    }
  }, [scalledImageData, offsetX, offsetY]);

  return (
    <ImageContext.Provider
      value={{
        canvasRef,
        setCanvasRef,
        imageData,
        scalledImageData,
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
        offsetX,
        offsetY,
        setOffsetX,
        setOffsetY,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}

export function useImageContext() {
  return useContext(ImageContext);
}
