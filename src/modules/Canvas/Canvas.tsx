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

    // Наблюдаем за изменениями размеров канваса
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    resizeObserver.observe(canvas);

    // Отписка при размонтировании
    return () => {
      resizeObserver.disconnect();
    };
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
