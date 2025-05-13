import { useEffect } from "react";
import { useTool } from "../../contexts/ToolContext/ToolContext";
import s from "./InstrumentsPanel.module.scss";
import { Instrument } from "./components/Instrument/Instrument";
import { getInstruments } from "./instruments";
import { useImageContext } from "../../contexts/ImageContext/ImageContext";

export function InstrumentsPanel() {
  const { activeToolID, setActiveToolID } = useTool();
  const { setOffsetX, setOffsetY } = useImageContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "h") {
        setActiveToolID(1);
      } else if (e.key === "p") {
        setActiveToolID(2);
      } else if (e.key === "ArrowUp") {
        setOffsetY((prev) => prev - 10);
      } else if (e.key === "ArrowDown") {
        setOffsetY((prev) => prev + 10);
      } else if (e.key === "ArrowLeft") {
        setOffsetX((prev) => prev - 10);
      } else if (e.key === "ArrowRight") {
        setOffsetX((prev) => prev + 10);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveToolID]);

  const instruments = getInstruments();
  return (
    <div className={s.instrumentsPanel}>
      {instruments.map((instrument) => (
        <Instrument
          key={instrument.tooltip}
          {...instrument}
          isActive={instrument.id === activeToolID}
        />
      ))}
    </div>
  );
}
