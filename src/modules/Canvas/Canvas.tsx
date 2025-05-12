import { useEffect, useRef, useContext } from "react";
import s from "./Canvas.module.scss";
import { ImageContext } from "../../contexts/ImageContext/ImageContext";

export function CanvasModule() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvasRef, renderMethod } = useContext(ImageContext);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Функция обновления размеров канваса
    const updateCanvasSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    // Сразу выставляем начальные размеры
    updateCanvasSize();
    setCanvasRef(canvasRef);
  }, [canvasRef, setCanvasRef]);

  return (
    <div className={s.canvasContainer}>
      <canvas
        className={s.canvas}
        ref={canvasRef}
        style={
          renderMethod === "pixelated" ? { imageRendering: "pixelated" } : {}
        }
      />
    </div>
  );
}
