import { useContext, useRef } from "react";
import { ImageContext } from "../../../contexts/ImageContext/ImageContext.tsx";

type ImageLoaderReturn = {
  input_ref: React.RefObject<null>;
  handleFileChange: (event: any) => void;
  handleButtonClick: () => void;
};

export function ImageLoader(): ImageLoaderReturn {
  const inputRef = useRef(null);
  const { loadImage } = useContext(ImageContext);

  function handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      loadImage(file);
    }
  }

  function handleButtonClick() {
    inputRef.current.click();
  }

  return {
    input_ref: inputRef,
    handleFileChange,
    handleButtonClick,
  };
}
