import { useEffect, useRef, useContext } from "react";
import s from "./Canvas.module.scss";
import { ImageContext } from "../../contexts/ImageContext/ImageContext";

export function CanvasModule() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { image } = useContext(ImageContext); // Предполагаем, что там `HTMLImageElement` или `ImageData`

  useEffect(
    function () {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!canvas || !ctx || !image) return;

      if (image instanceof HTMLImageElement) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
      }

      // Если у тебя ImageData (например, из gb7)
      if (image instanceof ImageData) {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.putImageData(image, 0, 0);
      }
    },
    [image],
  );

  return (
    <div className={s.canvasContainer}>
      <canvas className={s.canvas} ref={canvasRef}></canvas>
    </div>
  );
}
