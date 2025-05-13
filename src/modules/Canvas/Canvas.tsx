import { useEffect, useRef, useState } from "react";
import s from "./Canvas.module.scss";
import { useImageContext } from "../../contexts/ImageContext/ImageContext";
import { useTool } from "../../contexts/ToolContext/ToolContext";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function CanvasModule() {
  const {
    setCanvasRef,
    renderMethod,
    setOffsetX,
    setOffsetY,
    scalledImageData,
  } = useImageContext();
  const { activeToolID } = useTool();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeToolID === 1) {
      setIsDragging(true);
      lastPos.current = { x: e.clientX, y: e.clientY };
    }

    if (activeToolID === 2) {
      const canvas = canvasRef.current;
      if (!canvas || !scalledImageData) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const [r, g, b, a] = pixel;

      const rgba = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      console.log("Picked color:", rgba);
      console.log(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeToolID === 1) {
      if (!isDragging) return;
      if (!lastPos.current || !canvasRef.current || !scalledImageData) return;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;

      const imageWidth = scalledImageData.width;
      const imageHeight = scalledImageData.height;
      const canvasWidth = canvasRef.current.clientWidth;
      const canvasHeight = canvasRef.current.clientHeight;

      setOffsetX((prevX) => {
        const newX = prevX + dx;
        const minX = -imageWidth + 100;
        const maxX = canvasWidth - 100;
        return clamp(newX, minX, maxX);
      });

      setOffsetY((prevY) => {
        const newY = prevY + dy;
        const minY = -imageHeight + 100;
        const maxY = canvasHeight - 100;
        return clamp(newY, minY, maxY);
      });

      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastPos.current = null;
  };

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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          imageRendering: renderMethod === "pixelated" ? "pixelated" : "auto",
          cursor: activeToolID === 1 ? (isDragging ? "move" : "grab") : "auto",
        }}
      />
      {/*TODO: Спросить у Владислава Юрьевича, как можно сделать скролы */}
    </div>
  );
}
