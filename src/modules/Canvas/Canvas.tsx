import { useEffect, useRef, useContext } from "react";
import s from "./Canvas.module.scss";
import { ImageContext } from "../../contexts/ImageContext/ImageContext";

export function CanvasModule() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvasRef, width, height } = useContext(ImageContext);

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasRef(canvasRef);
    }
  }, [canvasRef, setCanvasRef]);

  const aspectRatio = width && height ? width / height : 1;

  return (
    <div className={s.canvasContainer}>
      <canvas className={s.canvas} ref={canvasRef} />
    </div>
  );
}
