import s from "./ActionItem.module.scss";

export type ActionItemProps = {
  icon?: string;
  text: string;
  onClick: () => void;
};

export function ActionItem(props: ActionItemProps) {
  return (
    <li className={s.actionItem} onClick={props.onClick} title={props.text}>
      {props.icon && <img className={s.icon} src={props.icon} />}
      <span className={s.title}>{props.text}</span>
    </li>
  );
}
