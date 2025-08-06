import { Modal } from "@mantine/core";

interface IProductDetailsModalProps {
  openModal: boolean;
  onModalClose: () => void;
  medicationDetails: any;
}

function ProductDetailsModal(modalProps: IProductDetailsModalProps) {
  return (
    <Modal.Root
      opened={modalProps?.openModal}
      onClose={modalProps?.onModalClose}
      size="1024px"
      centered
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body py={"lg"}>
          <Modal.Header>
            <div className="flex justify-end gap-3">
              <i
                className="icon-cross text-2xl leading-6 cursor-pointer"
                onClick={modalProps?.onModalClose}
              ></i>
            </div>
          </Modal.Header>
          <Modal.Body>
            <h4>Semaglutide Injection</h4>
          </Modal.Body>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default ProductDetailsModal;
