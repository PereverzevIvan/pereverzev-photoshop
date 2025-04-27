import { useContext } from "react";
import s from "./StatusBar.module.scss";
import { ImageContext } from "../../contexts/ImageContext/ImageContext";

export function StatusBar() {
  const { width, height, colorDepth } = useContext(ImageContext);

  return (
    <>
      <div className={s.statusBar}>
        <p className={s.property} title={`Размер: ${width}x${height}`}>
          <span className={s.propertyName}>Размер: </span>
          <span className={s.propertyValue}>
            {width}x{height}
          </span>
        </p>
        <p className={s.property} title={`Глубина цвета: ${colorDepth} bit`}>
          <span className={s.propertyName}>Глубина цвета: </span>
          <span className={s.propertyValue}>{colorDepth} bit</span>
        </p>
      </div>
    </>
  );
}
