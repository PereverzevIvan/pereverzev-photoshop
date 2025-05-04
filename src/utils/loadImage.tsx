import { getGB7ImageData, parseGB7Pixels } from "./ParseGB7";

export function loadStandardImage(file: File): Promise<ImageData | null> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Ошибка загрузки изображения
    img.onerror = () => reject("Ошибка загрузки изображения");

    img.onload = () => {
      // Создаем canvas для отрисовки изображения
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject("Не удалось получить контекст рисования");
      }

      // Устанавливаем размеры canvas как размеры изображения
      canvas.width = img.width;
      canvas.height = img.height;

      // Рисуем изображение на canvas
      ctx.drawImage(img, 0, 0);

      // Получаем и возвращаем ImageData
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };

    // Загружаем изображение
    img.src = URL.createObjectURL(file);
  });
}

// Загрузка GB7-изображения
export async function loadGB7Image(file: File): Promise<ImageData | null> {
  try {
    const buffer = await file.arrayBuffer();
    const imagePixels = parseGB7Pixels(buffer);

    if (!imagePixels) {
      alert(
        "Не удалось разобрать пиксели изображения. Возможно, файл поврежден.",
      );
      return null;
    }

    const imageData = await getGB7ImageData(imagePixels);
    if (!imageData) {
      alert("Не удалось загрузить изображение. Ошибка формата.");
      return null;
    }

    return imageData;
  } catch (error) {
    alert("Произошла ошибка при загрузке изображения: " + error);
    return null;
  }
}
