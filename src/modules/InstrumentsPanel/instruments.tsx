import { brush_icon } from "../../assets/images";
import { InstrumentProps } from "./components/Instrument/Instrument";

export function getInstruments(): InstrumentProps[] {
  return [
    {
      text: "Open",
      icon: brush_icon,
      onClick: () => {},
    },
  ];
}
