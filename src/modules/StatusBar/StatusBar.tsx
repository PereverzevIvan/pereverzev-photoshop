import { useContext } from "react";
import s from "./StatusBar.module.scss";
import { ImageContext } from "../../contexts/ImageContext/ImageContext";

export function StatusBar() {
  const { width, height, colorDepth } = useContext(ImageContext);

  return (
    <>
      <div className={s.statusBar}>
        <p className={s.property}>
          <span className={s.propertyName}>Исх. ширина: </span>
          <span className={s.propertyValue}>{width} px</span>
        </p>
        <p className={s.property}>
          <span className={s.propertyName}>Исх. высота: </span>
          <span className={s.propertyValue}>{height} px</span>
        </p>
        <p className={s.property}>
          <span className={s.propertyName}>Глубина цвета: </span>
          <span className={s.propertyValue}>{colorDepth} bit</span>
        </p>
      </div>
    </>
  );
}
