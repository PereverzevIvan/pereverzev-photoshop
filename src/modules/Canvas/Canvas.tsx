import { useEffect, useRef, useState } from "react";
import s from "./Canvas.module.scss";
import { useImageContext } from "../../contexts/ImageContext/ImageContext";
import { useTool } from "../../contexts/ToolContext/ToolContext";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function CanvasModule() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    setCanvasRef,
    renderMethod,
    setOffsetX,
    setOffsetY,
    scalledImageData,
  } = useImageContext();
  const { activeToolID } = useTool();

  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeToolID !== 1) return;
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeToolID !== 1) return;
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
    </div>
  );
}
