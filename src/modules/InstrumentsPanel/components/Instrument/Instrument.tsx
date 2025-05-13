import clsx from "clsx";
import s from "./Instrument.module.scss";
import { useTool } from "../../../../contexts/ToolContext/ToolContext";

export type InstrumentProps = {
  id: number;
  tooltip: string;
  icon?: string;
  isActive?: boolean;
  onClick: () => void;
};

export function Instrument(props: InstrumentProps) {
  const { setActiveToolID } = useTool();

  function handleClick(id: number) {
    setActiveToolID(id);
    props.onClick();
  }

  return (
    <button
      className={clsx(s.instrument, { [s.instrument_active]: props.isActive })}
      onClick={() => handleClick(props.id)}
      title={props.tooltip}
    >
      <img className={s.icon} src={props.icon} alt={props.tooltip} />
    </button>
  );
}
