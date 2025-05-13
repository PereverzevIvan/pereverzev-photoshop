import { hand_icon, selection_icon } from "../../assets/images";
import { InstrumentProps } from "./components/Instrument/Instrument";

export function getInstruments(): InstrumentProps[] {
  return [
    {
      id: 1,
      tooltip:
        "Инструмент 'Рука' (H).\nНеобходим для перемещения изображения по холсту. ",
      icon: hand_icon,
      onClick: () => {},
    },
    {
      id: 2,
      tooltip:
        "Инструмент 'Пипетка' (P).\nНеобходим для извлечения цвета из изображения. ",
      icon: selection_icon,
      onClick: () => {},
    },
  ];
}
