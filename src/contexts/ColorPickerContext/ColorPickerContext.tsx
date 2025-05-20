import { createContext, useContext, useState, useCallback } from "react";

type ColorPickerContextType = {
  firstPickedColor: number[] | null;
  secondPickedColor: number[] | null;
  firstPickedColorCoords: { x: number; y: number } | null;
  secondPickedColorCoords: { x: number; y: number } | null;
  setFirstPickedColorCoords: (coords: { x: number; y: number }) => void;
  setSecondPickedColorCoords: (coords: { x: number; y: number }) => void;
  setFirstPickedColor: (color: number[]) => void;
  setSecondPickedColor: (color: number[]) => void;
  pickColorAt: (
    x: number,
    y: number,
    canvas: HTMLCanvasElement,
    order: "first" | "second",
  ) => void;
};

const ColorPickerContext = createContext<ColorPickerContextType | undefined>(
  undefined,
);

export const ColorPickerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [firstPickedColor, setFirstPickedColor] = useState<number[] | null>(
    null,
  );
  const [secondPickedColor, setSecondPickedColor] = useState<number[] | null>(
    null,
  );
  const [firstPickedColorCoords, setFirstPickedColorCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [secondPickedColorCoords, setSecondPickedColorCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const pickColorAt = useCallback(
    (
      x: number,
      y: number,
      canvas: HTMLCanvasElement,
      order: "first" | "second",
    ) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const pixel = ctx.getImageData(x, y, 1, 1).data;

      if (order === "first") {
        setFirstPickedColor([pixel[0], pixel[1], pixel[2], pixel[3]]);
      } else {
        setSecondPickedColor([pixel[0], pixel[1], pixel[2], pixel[3]]);
      }
    },
    [],
  );

  return (
    <ColorPickerContext.Provider
      value={{
        firstPickedColor,
        secondPickedColor,
        firstPickedColorCoords,
        secondPickedColorCoords,
        setFirstPickedColorCoords,
        setSecondPickedColorCoords,
        setFirstPickedColor,
        setSecondPickedColor,
        pickColorAt,
      }}
    >
      {children}
    </ColorPickerContext.Provider>
  );
};

export const useColorPickerContext = () => {
  const ctx = useContext(ColorPickerContext);
  if (!ctx)
    throw new Error("useEyedropper must be used within an EyedropperProvider");
  return ctx;
};
