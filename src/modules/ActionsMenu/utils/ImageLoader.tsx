import { useContext, useRef } from "react";
import { ImageContext } from "../../../contexts/ImageContext/ImageContext.tsx";

type ImageLoaderReturn = {
  input_ref: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (event: any) => void;
  handleButtonClick: () => void;
};

export function ImageLoader(): ImageLoaderReturn {
  const inputRef = useRef<HTMLInputElement>(null);
  const { loadImage } = useContext(ImageContext);

  function handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      loadImage(file);
    }
  }

  function handleButtonClick() {
    if (!inputRef.current) return;
    inputRef.current.click();
  }

  return {
    input_ref: inputRef,
    handleFileChange,
    handleButtonClick,
  };
}
