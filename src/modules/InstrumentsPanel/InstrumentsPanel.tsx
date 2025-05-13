import { useEffect } from "react";
import { useTool } from "../../contexts/ToolContext/ToolContext";
import s from "./InstrumentsPanel.module.scss";
import { Instrument } from "./components/Instrument/Instrument";
import { getInstruments } from "./instruments";

export function InstrumentsPanel() {
  const { activeToolID, setActiveToolID } = useTool();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "h") {
        setActiveToolID(1); // hand
      } else if (e.key === "p") {
        setActiveToolID(2); // picker
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
