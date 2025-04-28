type ScaleImageProps = {
  imageWidth: number;
  imageHeight: number;
  scale: number;
};

type ScaleImageResult = {
  newCanvasWidth: number;
  newCanvasHeight: number;
  imageOffsetX: number;
  imageOffsetY: number;
};

const padding = 10;

export function scaleImage(props: ScaleImageProps): ScaleImageResult | null {
  const imgWidth = props.imageWidth;
  const imgHeight = props.imageHeight;
  console.log("Image size:", imgWidth, imgHeight);

  const canvasWidth = Math.round(imgWidth / props.scale) + padding;
  const canvasHeight = Math.round(imgHeight / props.scale) + padding;
  console.log("Canvas size:", canvasWidth, canvasHeight);

  // Центрируем изображение на canvas
  const offsetX = (canvasWidth - imgWidth) / 2;
  const offsetY = (canvasHeight - imgHeight) / 2;
  console.log("Offset:", offsetX, offsetY);

  return {
    newCanvasWidth: canvasWidth,
    newCanvasHeight: canvasHeight,
    imageOffsetX: offsetX,
    imageOffsetY: offsetY,
  };
}
