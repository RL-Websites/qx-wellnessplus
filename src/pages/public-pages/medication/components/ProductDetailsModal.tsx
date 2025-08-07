import { List, Modal, ThemeIcon } from "@mantine/core";

interface IProductDetailsModalProps {
  openModal: boolean;
  onModalClose: () => void;
  medicationDetails: {
    title?: string;
    image?: string;
    cost?: string;
  } | null;
}

function ProductDetailsModal({ openModal, onModalClose, medicationDetails }: IProductDetailsModalProps) {
  if (!medicationDetails) return null;

  return (
    <Modal.Root
      opened={openModal}
      onClose={onModalClose}
      centered={false}
      transitionProps={{ transition: "slide-left", duration: 300 }}
      radius="md"
      padding={0}
      size="840px"
    >
      <Modal.Overlay
        opacity={0.6}
        blur={4}
      />
      <Modal.Content className="!right-0 sm:!-right-10 !top-0 !h-full !w-full sm:!w-[840px] transition-all">
        <Modal.Body className="!p-8 h-full overflow-y-auto relative">
          <div className="flex items-center justify-end gap-3">
            <i
              className="icon-cross1 text-2xl/none cursor-pointer text-primary"
              onClick={onModalClose}
            ></i>
          </div>
          <div className="pt-20 max-w-[500px]">
            <h2 className="md:text-5xl text-3xl font-bold mb-4 leading-snug text-foreground">{medicationDetails.title}</h2>
            {medicationDetails.cost && <p className="mb-6 text-gray-600 font-semibold">Cost: {medicationDetails.cost}</p>}

            <p className="md:text-[32px] text-xl font-medium text-foreground pb-4">About the Product:</p>
            <List
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon
                  color="violet"
                  size={20}
                  radius="xl"
                >
                  <i className="icon-tick text-xl/noe"></i>
                </ThemeIcon>
              }
            >
              <List.Item>Doctors Appointment, Prescription included</List.Item>
              <List.Item>Fast Shipping</List.Item>
              <List.Item>All Supplies Included</List.Item>
              <List.Item>Unlimited Weight Loss Program Support</List.Item>
              <List.Item>Bypass Insurance – No Insurance Needed</List.Item>
              <List.Item>No Hidden Fees</List.Item>
            </List>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default ProductDetailsModal;
