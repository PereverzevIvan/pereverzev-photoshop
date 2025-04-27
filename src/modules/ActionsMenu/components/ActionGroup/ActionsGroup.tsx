import s from "./ActionsGroup.module.scss";
import { ActionItem, ActionItemProps } from "../ActionItem/ActionItem.tsx";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";

export type ActionsGroupProps = {
  title: string;
  items: ActionItemProps[];
};

export function ActionsGroup(props: ActionsGroupProps) {
  const [showList, setShowList] = useState(false);
  const titleRef = useRef<HTMLParagraphElement>(null);

  function handleTitleClick() {
    setShowList((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        titleRef.current &&
        !titleRef.current.contains(event.target as Node)
      ) {
        setShowList(false);
      }
    }

    if (showList) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showList]);

  return (
    <div className={s.actionsGroup}>
      <span
        ref={titleRef}
        className={clsx(s.title, { [s.title_active]: showList })}
        onClick={handleTitleClick}
      >
        {props.title}
      </span>
      {showList && (
        <ul className={clsx(s.actionsList, { [s.actionsList_show]: showList })}>
          {props.items.map((item) => (
            <ActionItem key={item.text} {...item} />
          ))}
        </ul>
      )}
    </div>
  );
}
