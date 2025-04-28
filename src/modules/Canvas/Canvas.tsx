import { useEffect, useRef, useContext } from "react";
import s from "./Canvas.module.scss";
import { ImageContext } from "../../contexts/ImageContext/ImageContext";

export function CanvasModule() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvasRef, width, height, renderMethod } =
    useContext(ImageContext);

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasRef(canvasRef);
    }
  }, [canvasRef, setCanvasRef]);

  return (
    <div className={s.canvasContainer}>
      <canvas
        className={s.canvas}
        ref={canvasRef}
        style={
          renderMethod == "pixelated" ? { imageRendering: "pixelated" } : {}
        }
        width={width}
        height={height}
      />
    </div>
  );
}
