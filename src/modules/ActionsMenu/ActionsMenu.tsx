import { useContext, useRef } from "react";
import { open_icon } from "../../assets/images/actions";
import s from "./ActionsMenu.module.scss";
import { ActionsGroup } from "./components/ActionList/ActionsGroup";
import { ImageContext } from "../../contexts/ImageContext/ImageContext";

export function ActionsMenu() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { loadImage } = useContext(ImageContext);

  function handleFileOpen() {
    if (inputRef.current) inputRef.current.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      alert("Файл не загружен. Не переданы файлы");
      return;
    }
    const file = event.target.files[0];
    if (file) {
      loadImage(file);
    }
  }

  const actionsGroups = [
    {
      title: "Файл",
      items: [
        {
          text: "Загрузить изображение",
          icon: open_icon,
          onClick: handleFileOpen,
        },
      ],
    },
  ];

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.gb7"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className={s.actionsMenu}>
        <ActionsGroup title="Файл" items={actionsGroups[0].items} />
      </div>
    </>
  );
}
