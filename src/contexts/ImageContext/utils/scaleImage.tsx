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

const padding = 50;

export function scaleImage(props: ScaleImageProps): ScaleImageResult | null {
  const imgWidth = props.imageWidth;
  const imgHeight = props.imageHeight;

  const canvasWidth = Math.round(imgWidth / props.scale) + padding;
  const canvasHeight = Math.round(imgHeight / props.scale) + padding;

  // Центрируем изображение на canvas
  const offsetX = (canvasWidth - imgWidth) / 2;
  const offsetY = (canvasHeight - imgHeight) / 2;

  return {
    newCanvasWidth: canvasWidth,
    newCanvasHeight: canvasHeight,
    imageOffsetX: offsetX,
    imageOffsetY: offsetY,
  };
}
