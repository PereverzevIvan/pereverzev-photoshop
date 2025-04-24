import s from "./ActionsGroup.module.scss";
import { ActionItem, ActionItemProps } from "../ActionItem/ActionItem.tsx";
import clsx from "clsx";
import { useState } from "react";

export type ActionsGroupProps = {
  title: string;
  items: ActionItemProps[];
};

export function ActionsGroup(props: ActionsGroupProps) {
  const [showList, setShowList] = useState(false);

  function onClickOnTitle() {
    setShowList(!showList);
  }

  return (
    <>
      <div className={s.actionsGroup}>
        <span
          className={clsx(s.title, { [s.title_active]: showList })}
          onClick={onClickOnTitle}
        >
          {props.title}
        </span>
        <ul
          className={clsx(s.actionsList, { [s.actionsList_show]: showList })}
          onClick={onClickOnTitle}
        >
          {props.items.map((item) => (
            <ActionItem key={item.text} {...item} />
          ))}
        </ul>
      </div>
    </>
  );
}
