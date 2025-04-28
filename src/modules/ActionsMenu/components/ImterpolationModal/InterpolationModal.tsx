import { useContext } from "react";
import { Modal } from "../../../../components/ModalWindow/ModalWindow";
import { ImageContext } from "../../../../contexts/ImageContext/ImageContext";
import { InterpolationForm } from "../InterpolationForm/InterpolationForm";

type InterpolationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

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
