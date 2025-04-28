import { useContext, useEffect } from "react";
import s from "./StatusBar.module.scss";
import { ImageContext } from "../../contexts/ImageContext/ImageContext";

export function StatusBar() {
  const {
    width,
    height,
    colorDepth,
    setScaleValue,
    renderMethod,
    setRenderMethod,
  } = useContext(ImageContext);

  function handleChangeScale(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = parseFloat(event.target.value);
    setScaleValue(value);
  }
  function handleChangeRenderMethod(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value as "normal" | "pixelated";
    setRenderMethod(value);
  }

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

        <select
          name="renderMethod"
          id="renderMethod"
          defaultValue={renderMethod}
          onChange={handleChangeRenderMethod}
        >
          <option value="normal">Нормальный</option>
          <option value="pixelated">Пиксели</option>
        </select>

        <select
          name="scale"
          id="scale"
          defaultValue={1}
          onChange={handleChangeScale}
        >
          <option value="0.12">12%</option>
          <option value="0.5">50%</option>
          <option value="1">100%</option>
          <option value="1.5">150%</option>
          <option value="2">200%</option>
          <option value="2.5">250%</option>
          <option value="3">300%</option>
        </select>
      </div>
    </>
  );
}
