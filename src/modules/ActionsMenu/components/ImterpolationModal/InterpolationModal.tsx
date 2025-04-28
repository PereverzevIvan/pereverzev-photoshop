import { useContext } from "react";
import { Modal } from "../../../../components/ModalWindow/ModalWindow";
import { ImageContext } from "../../../../contexts/ImageContext/ImageContext";
import s from "./InterpolationModal.module.scss";
import { useForm } from "react-hook-form";

type InterpolationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type InterpolationForm = {
  unit: "percent" | "pixel";
  newWidth: number;
  newHeight: number;
  aspectRatio: boolean;
  interpolation: "nearest" | "bilinear";
};

type InterpolationFormProps = {
  onClose: () => void;
};

export function InterpolationForm(props: InterpolationFormProps) {
  const { resizeImage, width, height } = useContext(ImageContext);
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<InterpolationForm>({
    defaultValues: {
      unit: "pixel",
      newWidth: width,
      newHeight: height,
      aspectRatio: false,
      interpolation: "nearest",
    },
  });

  const onSubmit = (data: InterpolationForm) => {
    resizeImage(data.newWidth, data.newHeight, data.interpolation);
    props.onClose();
  };

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="unit-select">Единица изменения:</label>
      <select id="unit-select" {...register("unit", { required: true })}>
        <option value="percent">%</option>
        <option value="pixel">px</option>
      </select>
      {errors.unit && <p>Выберите единицу измерения</p>}

      <label htmlFor="new-image-width">Новая ширина:</label>
      <input
        type="number"
        id="new-image-width"
        {...register("newWidth", {
          required: "Введите новую ширину",
          min: { value: 1, message: "Ширина должна быть больше 0" },
          max: { value: 10000, message: "Слишком большая ширина" },
        })}
      />
      {errors.newWidth && <p>{errors.newWidth.message}</p>}

      <label htmlFor="new-image-height">Новая высота:</label>
      <input
        type="number"
        id="new-image-height"
        {...register("newHeight", {
          required: "Введите новую высоту",
          min: { value: 1, message: "Высота должна быть больше 0" },
          max: { value: 10000, message: "Слишком большая высота" },
        })}
      />
      {errors.newHeight && <p>{errors.newHeight.message}</p>}

      <label htmlFor="aspect-ratio">Сохранять пропорции:</label>
      <input type="checkbox" id="aspect-ratio" {...register("aspectRatio")} />

      <label htmlFor="interpolation-select">Способ масштабирования:</label>
      <select
        id="interpolation-select"
        {...register("interpolation", { required: true })}
      >
        <option value="nearest">nearest</option>
        <option value="bilinear">bilinear</option>
      </select>
      {errors.interpolation && <p>Выберите способ масштабирования</p>}

      <button type="submit">Изменить масштаб</button>
    </form>
  );
}

export function InterpolationModal(props: InterpolationModalProps) {
  const title = "Интерполяция";
  const { imageData } = useContext(ImageContext);

  return (
    <Modal {...props} title={title}>
      {imageData ? (
        <InterpolationForm onClose={props.onClose} />
      ) : (
        <p>Изображение не загружено</p>
      )}
    </Modal>
  );
}
