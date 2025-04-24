import React, { createContext, useState } from "react";

export type ImageContextProps = {
  image: HTMLImageElement | null;
  width: number;
  height: number;
  colorDepth: number;
  loadImage: (file: File) => void;
};

const defaultContext: ImageContextProps = {
  image: null,
  width: 0,
  height: 0,
  colorDepth: 0,
  loadImage: function () {},
};

export const ImageContext = createContext<ImageContextProps>(defaultContext);

export function ImageProvider(props: { children: React.ReactNode }) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [colorDepth, setColorDepth] = useState<number>(0);

  function loadImage(file: File): void {
    const img = new Image();
    img.onload = function () {
      setImage(img);
      setWidth(img.width);
      setHeight(img.height);
      setColorDepth(8);
    };
    img.src = URL.createObjectURL(file);
  }

  return (
    <ImageContext.Provider
      value={{
        image: image,
        width: width,
        height: height,
        colorDepth: colorDepth,
        loadImage: loadImage,
      }}
    >
      {props.children}
    </ImageContext.Provider>
  );
}
