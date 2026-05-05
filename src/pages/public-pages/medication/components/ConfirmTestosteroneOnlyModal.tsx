import { IPartnerMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import dmlToast from "@/common/configs/toaster.config";
import LabSection from "@/pages/public-pages/order-summary/components/LabSection";
import { LabSubmissionType } from "@/pages/public-pages/order-summary/components/LabTypeSectionModal";
import { ActionIcon, Button, CheckIcon, Modal, Radio } from "@mantine/core";
import { useEffect, useState } from "react";

interface IConfirmationModalProps {
  openModal: boolean;
  onModalClose: (closeReason: boolean) => void;
  onModalPressYes: (labRequired: number, shippingType: string, labType: LabSubmissionType | null, reports: any[]) => void;
  onModalPressNo: () => void;
  medicationName?: string;
  medicationInfo?: IPartnerMedicineListItem[];
  okBtnLoading: boolean;
  overNightShippingFee?: string | number;
  showShippingType?: boolean;
  medicationDetails: {
    id?: number;
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
    full_strength?: string;
    unit?: string;
    is_research_only?: number;
    total_price?: string;
    customer_medication?: { id?: number; price?: string };
    direction_sig?: string;
    lab_package?: any;
  } | null;
}

function ConfirmTestosteroneOnlyModal(modalProps: IConfirmationModalProps) {
  if (!modalProps?.medicationDetails) return null;
  const [shippingType, setShippingType] = useState<string>("Regular");
  const [selectedLabType, setSelectedLabType] = useState<LabSubmissionType | null>(null);
  const [selectedReports, setSelectedReports] = useState<any[]>([]);

  useEffect(() => {
    if (modalProps.openModal) {
      setShippingType("Regular");
      setSelectedLabType(null);
      setSelectedReports([]);
    }
  }, [modalProps.openModal]);

  const examinations = modalProps?.medicationDetails?.lab_package?.examinations ?? [];

  const handleAgree = () => {
    if (!selectedLabType) {
      dmlToast.error({
        title: "Lab option required",
        message: "Please choose a lab option before continuing.",
      });
      return;
    }
    // labRequired is always 1 for testosterone (mandatory).
    modalProps.onModalPressYes(1, shippingType, selectedLabType, selectedReports);
  };

  return (
    <Modal.Root
      opened={modalProps.openModal}
      onClose={() => modalProps.onModalClose(false)}
      closeOnClickOutside={false}
      centered
      classNames={{
        content: "md:min-w-[540px]",
      }}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header className="!pb-3">
          <Modal.Title className="font-poppins md:!text-3xl sm:!text-2xl text-xl">
            {modalProps?.medicationDetails?.name} {modalProps?.medicationDetails?.strength}
            {modalProps?.medicationDetails?.unit}
          </Modal.Title>
          <ActionIcon
            onClick={() => modalProps.onModalClose(false)}
            radius="100%"
            bg="dark"
            size="24"
          >
            <i className="icon-cross1 text-xs"></i>
          </ActionIcon>
        </Modal.Header>
        <Modal.Body className="pt-0 pb-lg">
          <div className="bg-tag-bg py-4 px-5 rounded-xl space-y-2 animate-content">
            <h6 className="text-tag-bg-deep font-semibold">Lab Testing is Mandatory for All Testosterone Treatments.</h6>
            <p className="text-tag-bg-deep text-sm">
              Your lab results are required for the doctor's review before approval. Please choose how you would like to provide them below.
            </p>
          </div>

          {/*
            No real Prescription exists at this pre-checkout step (QX is payment-first),
            so we intentionally do NOT pass `prescriptionId`. SelectedLabOption will hide
            the "Download Lab Requisition" button and show a "available after the order
            is placed" notice instead. The selected lab option is persisted on the cart
            item and the requisition becomes downloadable from the order/prescription
            screens after checkout.
          */}
          <LabSection
            examinations={examinations}
            prescriptionId={null}
            prescriptionDetailId={null}
            value={selectedLabType}
            onSelectionChange={setSelectedLabType}
            reports={selectedReports}
            onReportsChange={setSelectedReports}
          />

          {modalProps.showShippingType && (
            <div className="mt-6">
              <Radio.Group
                label="Shipping Type"
                value={shippingType}
                onChange={(value) => setShippingType(value)}
                className="w-full animate-content"
              >
                <div className="grid md:grid-cols-2 gap-5 w-full mt-4">
                  {["Regular", "Overnight"].map((type) => (
                    <Radio
                      key={type}
                      icon={CheckIcon}
                      value={type}
                      label={
                        <div className="relative text-center">
                          <span className="text-foreground font-poppins">{type === "Overnight" ? `Overnight (+ $${modalProps.overNightShippingFee || "0"})` : "Regular"}</span>
                          {shippingType === type && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:-right-4 -right-3 -translate-y-1/2">
                              <i className="icon-tick text-sm/none"></i>
                            </span>
                          )}
                        </div>
                      }
                      classNames={{
                        root: "relative w-full",
                        radio: "hidden",
                        inner: "hidden",
                        labelWrapper: "w-full",
                        label: " block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointer border-grey bg-transparent text-black",
                      }}
                    />
                  ))}
                </div>
              </Radio.Group>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 mt-6">
            <Button
              className="w-full"
              color="grey.4"
              c="foreground"
              classNames={{
                label: "sm:text-base text-sm",
              }}
              onClick={() => modalProps.onModalPressNo()}
              disabled={modalProps.okBtnLoading}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              classNames={{
                label: "sm:text-base text-sm",
              }}
              onClick={handleAgree}
              disabled={modalProps.okBtnLoading}
            >
              I Agree
            </Button>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default ConfirmTestosteroneOnlyModal;
