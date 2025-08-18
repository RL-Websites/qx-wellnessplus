import { Modal } from "@mantine/core";

interface IProductDetailsModalProps {
  openModal: boolean;
  onModalClose: () => void;
  medicationDetails: {
    name?: string;
    image?: string;
    cost?: string;
    medication_category?: string;
    medicine_group?: string;
    medicine_type?: string;
    ndc?: string;
    price?: string;
    duration?: string;
    days_supply?: string;
    service_fee?: string;
    shipping_fee?: string;
    doctor_fee?: string;
    stripe_fee?: string;
    lab_fee?: string;
    sku?: string;
    strength?: string;
    unit?: string;
    is_research_only?: number;
    total_price?: string;
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
        <Modal.Body className="lg:!p-8 md:!p-5 !p-4 h-full overflow-y-auto relative">
          <div className="flex items-center justify-end gap-3">
            <i
              className="icon-cross1 text-2xl/none cursor-pointer text-primary"
              onClick={onModalClose}
            ></i>
          </div>
          <div className="lg:pt-20 md:pt-10 pt-5">
            <h2 className="md:text-5xl text-3xl !leading-snug font-poppins  font-bold mb-4  text-foreground">{medicationDetails.name}</h2>
            {medicationDetails.cost && <p className="my-6 text-2xl text-gray-600 font-semibold">Cost: {medicationDetails.cost}</p>}

            <p className="md:text-[32px] text-xl font-medium text-foreground pb-4">About the Product:</p>
            <div className="grid grid-cols-2 gap-5 border-t border-grey-medium pt-5">
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">SKU :</h6>
                <p className="text-fs-md">{medicationDetails?.sku}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Dose :</h6>
                <p className="text-fs-md">
                  {medicationDetails?.strength}
                  {medicationDetails?.unit}
                </p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">NDC :</h6>
                <p className="text-fs-md">{medicationDetails?.ndc}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Strength :</h6>
                <p className="text-fs-md">{medicationDetails?.strength}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Medication Group :</h6>
                <p className="text-fs-md">{medicationDetails?.medicine_group}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Medication Category :</h6>
                <p className="text-fs-md">{medicationDetails?.medication_category}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Medication Type :</h6>
                <p className="text-fs-md">{medicationDetails?.medicine_type}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Duration :</h6>
                <p className="text-fs-md">{medicationDetails?.duration || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Days Supply :</h6>
                <p className="text-fs-md">{medicationDetails?.duration || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Research Only :</h6>
                <p className="text-fs-md">{medicationDetails?.is_research_only === 1 ? "Yes" : "No"}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Doctor Fee :</h6>
                <p className="text-fs-md">${medicationDetails?.doctor_fee || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Price :</h6>
                <p className="text-fs-md">${medicationDetails?.price || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Shipping Fee :</h6>
                <p className="text-fs-md">${medicationDetails?.shipping_fee || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Stripe Fee :</h6>
                <p className="text-fs-md">${medicationDetails?.stripe_fee || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Service Fee :</h6>
                <p className="text-fs-md">${medicationDetails?.service_fee || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h6 className="text-fs-sp font-semibold">Lab Fee :</h6>
                <p className="text-fs-md">${medicationDetails?.lab_fee || "N/A"}</p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default ProductDetailsModal;
