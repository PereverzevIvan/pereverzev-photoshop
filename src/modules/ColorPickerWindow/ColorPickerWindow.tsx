import { useColorPickerContext } from "../../contexts/ColorPickerContext/ColorPickerContext";
import { useTool } from "../../contexts/ToolContext/ToolContext";
import {
  getContrast,
  rgbaToOklch,
  rgbToXyz,
  xyzToLab,
} from "../../utils/colorSchemes";
import s from "./ColorPickerWindow.module.scss";

export function ColorInfoPanel() {
  const { firstPickedColor, secondPickedColor } = useColorPickerContext();
  const { activeToolID } = useTool();

  const format = (value: number, digits = 2) => value.toFixed(digits);

  const renderColorSpaces = (label: string, color: number[]) => {
    const xyz = rgbToXyz(color);
    const lab = xyzToLab(xyz);
    const lch = rgbaToOklch(color[0], color[1], color[2]);

    return (
      <div className={s.colorInfo}>
        <div>{label}</div>
        <div>RGB: {color.map((c) => Math.round(c)).join(", ")}</div>
        <div title="X, Y, Z — координаты цвета в пространстве XYZ. Y отвечает за яркость.">
          XYZ: {xyz.map((v) => format(v)).join(", ")}
        </div>
        <div title="Lab: L (светлота), a (от зелёного к красному), b (от синего к жёлтому).">
          Lab: {lab.map((v) => format(v)).join(", ")}
        </div>
        <div title="OKLch: L (светлота), C (насыщенность), h (оттенок в градусах).">
          OKLch: `{lch.l.toFixed(2)}, ${lch.c.toFixed(2)}, ${lch.h.toFixed(2)}`
        </div>
        <div
          className={s.colorPreview}
          style={{ backgroundColor: `rgb(${color.join(", ")})` }}
        ></div>
      </div>
    );
  };

  const contrastText = () => {
    if (!firstPickedColor || !secondPickedColor)
      return "Выберите два цвета пипеткой для расчёта контраста.";
    const contrast = getContrast(firstPickedColor, secondPickedColor);
    return contrast < 4.5
      ? `Контраст: ${contrast} — недостаточный (менее 4.5:1)`
      : `Контраст: ${contrast} — достаточный`;
  };

  return (
    <div
      className={s.colorPickerInfo}
      style={{ display: activeToolID == 2 ? "flex" : "none" }}
    >
      <div className={s.colorInfoContainer}>
        {firstPickedColor && renderColorSpaces("Первый цвет", firstPickedColor)}
        {secondPickedColor &&
          renderColorSpaces("Второй цвет", secondPickedColor)}
      </div>
      <p>{contrastText()}</p>
    </div>
  );
}
