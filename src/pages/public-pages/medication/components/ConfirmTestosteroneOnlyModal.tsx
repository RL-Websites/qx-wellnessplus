import { IPartnerMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { ActionIcon, Button, CheckIcon, Modal, Radio } from "@mantine/core";
import { useState } from "react";

interface IConfirmationModalProps {
  openModal: boolean;
  onModalClose: (closeReason: boolean) => void;
  onModalPressYes: (labRequired: number) => void;
  onModalPressNo: (qty: number) => void;
  medicationName?: string;
  medicationInfo?: IPartnerMedicineListItem[];
  okBtnLoading: boolean;
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
    full_strength?: string;
    unit?: string;
    is_research_only?: number;
    total_price?: string;
    customer_medication?: { price?: string };
    direction_sig?: string;
  } | null;
}

function ConfirmTestosteroneOnlyModal(modalProps: IConfirmationModalProps) {
  if (!modalProps?.medicationDetails) return null;
  const [labRequired, setLabRequired] = useState<number>(1);

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
          <div className="">
            <Radio.Group
              label="Select Option"
              value={String(labRequired)}
              onChange={(value) => {
                setLabRequired(Number(value));
              }}
              name="favoriteFramework"
              className="mt-6 w-full animate-content"
            >
              <div className="grid md:grid-cols-2 gap-5 w-full">
                <Radio
                  icon={CheckIcon}
                  value="1"
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">With Lab</span>
                      {labRequired === 1 && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
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
                    label: " block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointerborder-grey bg-transparent text-black",
                  }}
                />
                <Radio
                  icon={CheckIcon}
                  value="2"
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">Without Lab</span>
                      {labRequired === 2 && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
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
                    label: " block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointerborder-grey bg-transparent text-black",
                  }}
                />
              </div>
            </Radio.Group>
          </div>
          <div className="bg-tag-bg py-6 px-6 rounded-xl mt-5 space-y-4 animate-content">
            <h6 className="text-tag-bg-deep font-semibold text-lg">Lab Testing is Mandatory for All Testosterone Treatments.</h6>

            <p className="text-tag-bg-deep">Your lab results are required for the doctor's review before approval.</p>

            <p className="text-tag-bg-deep">You have two options:</p>

            <div className="space-y-4">
              <div>
                <p className="text-tag-bg-deep">
                  <span className="inline-flex items-center mr-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <strong>Option 1 — Quest Diagnostics (Recommended):</strong>
                </p>
                <ul className="list-disc pl-8 mt-2 space-y-1 text-tag-bg-deep">
                  <li>Get your lab test done at any Quest Diagnostics location.</li>
                  <li>Simple scheduling and direct integration with our system.</li>
                  <li>Fastest way to get your prescription reviewed.</li>
                </ul>
              </div>

              <div>
                <p className="text-tag-bg-deep">
                  <span className="inline-flex items-center mr-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <strong>Option 2 — Use Your Own Preferred Lab:</strong>
                </p>
                <p className="text-tag-bg-deep pl-6 mt-1 mb-2">You may choose a different certified lab.</p>
                <p className="text-tag-bg-deep pl-6 mb-2">
                  <strong>Required Panels:</strong>
                </p>
                <ul className="list-disc pl-12 space-y-1 text-tag-bg-deep">
                  <li>Total Testosterone</li>
                  <li>Free Testosterone</li>
                  <li>CBC (Complete Blood Count)</li>
                  <li>CMP (Comprehensive Metabolic Panel)</li>
                  <li>Lipid Panel</li>
                  <li>PSA (for men 40+)</li>
                </ul>
              </div>
            </div>

            <p className="text-tag-bg-deep text-sm">
              After testing, upload your lab report directly to your Dosevana portal. Please ensure your report is clear and includes all mandatory panels.
            </p>

            <p className="text-yellow-800 font-medium">
              <strong>Important:</strong> Without these lab results, our doctors cannot proceed with your prescription.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-6">
            <Button
              className="w-full"
              color="grey.4"
              c="foreground"
              classNames={{
                label: "sm:text-base text-sm",
              }}
              onClick={() => modalProps.onModalPressNo(labRequired)}
              disabled={modalProps.okBtnLoading}
            >
              Do Not Proceed
            </Button>
            <Button
              className="w-full"
              classNames={{
                label: "sm:text-base text-sm",
              }}
              onClick={() => modalProps.onModalPressYes(labRequired)}
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
