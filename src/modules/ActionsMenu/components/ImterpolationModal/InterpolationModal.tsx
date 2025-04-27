import { Modal } from "../../../../components/ModalWindow/ModalWindow";

type InterpolationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function InterpolationModal(props: InterpolationModalProps) {
  const title = "Интерполяция";

  return (
    <Modal {...props} title={title}>
      <p>Выберите метод интерполяции</p>
    </Modal>
  );
}
