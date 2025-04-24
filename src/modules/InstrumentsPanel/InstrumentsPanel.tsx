import s from "./InstrumentsPanel.module.scss";
import { Instrument } from "./components/Instrument/Instrument";
import { getInstruments } from "./instruments";

export function InstrumentsPanel() {
  const instruments = getInstruments();
  return (
    <div className={s.instrumentsPanel}>
      {instruments.map((instrument) => (
        <Instrument key={instrument.text} {...instrument} />
      ))}
    </div>
  );
}
