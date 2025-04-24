import s from "./Instrument.module.scss";

export type InstrumentProps = {
  text: string;
  icon?: string;
  onClick: () => void;
};

export function Instrument(props: InstrumentProps) {
  return (
    <button className={s.instrument} onClick={props.onClick} title={props.text}>
      <img className={s.icon} src={props.icon} alt={props.text} />
    </button>
  );
}
