import { useContext, useRef, useState } from "react";
import s from "./ActionsMenu.module.scss";
import { ActionsGroup } from "./components/ActionGroup/ActionsGroup";
import { ImageContext } from "../../contexts/ImageContext/ImageContext";
import { open_icon } from "../../assets/images";
import { InterpolationModal } from "./components/ImterpolationModal/InterpolationModal";

export function ActionsMenu() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { loadImage, clearImage } = useContext(ImageContext);
  const [isOpenInterpolation, setIsOpenInterpolation] = useState(false);

  function handleFileOpen() {
    if (inputRef.current) inputRef.current.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
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
    {
      title: "Холст",
      items: [
        {
          text: "Интерполяция",
          onClick: () => {
            // resizeImage(1230, 1560, "bilinear");
            setIsOpenInterpolation(true);
          },
        },
        {
          text: "Очистить холст",
          onClick: () => {
            clearImage();
          },
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
      <InterpolationModal
        isOpen={isOpenInterpolation}
        onClose={() => setIsOpenInterpolation(false)}
      />

      <div className={s.actionsMenu}>
        {actionsGroups.map((group, index) => (
          <ActionsGroup key={index} {...group} />
        ))}
      </div>
    </>
  );
}
