import { useContext, useEffect, useMemo } from "react";
import s from "./InterpolationForm.module.scss";
import { useForm, useWatch } from "react-hook-form";
import { ImageContext } from "../../../../contexts/ImageContext/ImageContext";

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

const InterpolationTooltip = `\
- Ближайший сосед: Быстрый метод. Подходит для пиксельной графики, но может давать неровные края.

- Билинейная интерполяция: Более плавное масштабирование. Хорошо подходит для фотографий и мягких переходов.
`;

export function InterpolationForm(props: InterpolationFormProps) {
  const { resizeImage, width, height } = useContext(ImageContext);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    // getValues,
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

  const unit = useWatch({ control, name: "unit" });
  const aspectRatio = useWatch({ control, name: "aspectRatio" });
  const newWidth = useWatch({ control, name: "newWidth" });
  const newHeight = useWatch({ control, name: "newHeight" });

  const originalMegapixels = useMemo(
    () => (width * height) / 1_000_000,
    [width, height],
  );
  const newMegapixels = useMemo(() => {
    if (unit === "percent") {
      return (
        (((width * newWidth) / 100) * ((height * newHeight) / 100)) / 1_000_000
      );
    } else return (newWidth * newHeight) / 1_000_000;
  }, [unit, newWidth, newHeight, width, height]);

  // Автоматическое изменение высоты при изменении ширины, если сохранение пропорций включено
  useEffect(() => {
    if (aspectRatio) {
      if (unit === "percent") {
        setValue("newHeight", newWidth);
        return;
      }

      const ratio = height / width;
      setValue("newHeight", Math.round(newWidth * ratio));
    }
  }, [unit, newWidth, aspectRatio, height, width, setValue]);

  useEffect(() => {
    if (unit === "percent") {
      setValue("newWidth", 100);
      setValue("newHeight", 100);
    } else {
      setValue("newWidth", width);
      setValue("newHeight", height);
    }
  }, [unit]);

  const onSubmit = (data: InterpolationForm) => {
    if (data.unit === "percent") {
      data.newWidth = Math.round((data.newWidth / 100) * width);
      data.newHeight = Math.round((data.newHeight / 100) * height);
    }

    resizeImage(data.newWidth, data.newHeight, data.interpolation);
    props.onClose();
  };

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={s.megapixelsInfo}>
        <p>Исходное изображение: {originalMegapixels.toFixed(2)} Мп</p>
        <p>Новое изображение: {newMegapixels.toFixed(2)} Мп</p>
      </div>

      <div className={s.inputContainer}>
        <label htmlFor="unit-select">Единица измерения:</label>
        <select id="unit-select" {...register("unit", { required: true })}>
          <option value="percent">%</option>
          <option value="pixel">px</option>
        </select>
        {errors.unit && <p className={s.error}>Выберите единицу измерения</p>}
      </div>

      <div className={s.inputContainer}>
        <label htmlFor="newWidth">Ширина ({unit}):</label>
        <input
          type="number"
          id="newWidth"
          {...register("newWidth", {
            required: "Введите ширину",
            min: { value: 1, message: "Ширина должна быть больше 0" },
            max: {
              value: unit === "pixel" ? width * 3 : 300,
              message:
                unit === "pixel" ? "Слишком большая ширина" : "Максимум 100%",
            },
          })}
        />
        {errors.newWidth && (
          <p className={s.error}>{errors.newWidth.message}</p>
        )}
      </div>

      <div className={s.inputContainer}>
        <label htmlFor="newHeight">Высота ({unit}):</label>
        <input
          type="number"
          id="newHeight"
          {...register("newHeight", {
            required: "Введите высоту",
            min: { value: 1, message: "Высота должна быть больше 0" },
            max: {
              value: unit === "pixel" ? height * 3 : 300,
              message:
                unit === "pixel" ? "Слишком большая высота" : "Максимум 100%",
            },
          })}
          disabled={aspectRatio}
        />
        {errors.newHeight && (
          <p className={s.error}>{errors.newHeight.message}</p>
        )}
      </div>

      <label className={s.checkboxLabel}>
        <input type="checkbox" {...register("aspectRatio")} />
        Сохранять пропорции
      </label>

      <div className={s.inputContainer}>
        <label htmlFor="interpolation-select" title={InterpolationTooltip}>
          Способ масштабирования:
        </label>
        <select
          id="interpolation-select"
          {...register("interpolation", { required: true })}
        >
          <option value="nearest">Ближайший сосед</option>
          <option value="bilinear">Билинейная интерполяция</option>
        </select>
        {errors.interpolation && (
          <p className={s.error}>Выберите способ масштабирования</p>
        )}
      </div>

      <button type="submit">Применить изменения</button>
    </form>
  );
}
