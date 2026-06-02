import { IPartnerMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { Button, Modal, Radio } from "@mantine/core";
import { IconCircleCheck, IconInfoCircleFilled } from "@tabler/icons-react";
import { useState } from "react";

interface IConfirmationModalProps {
  openModal: boolean;
  onModalClose: (closeReason: boolean) => void;
  onModalPressYes: () => void;
  onModalPressNo: (qty: number, shippingType: string) => void;
  category_name?: string;
  okBtnLoading: boolean;
  medicationInfo?: IPartnerMedicineListItem[];
  overNightShippingFee?: string | number;
  showShippingType?: boolean;
  is_research_only?: number;
}

function ConfirmProductOrderModal(modalProps: IConfirmationModalProps) {
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [shippingType, setShippingType] = useState<string>("Regular");
  const isQuantityCategory = ["Single Peptides", "Peptides Blends", "Energy & Longevity"].includes(modalProps.category_name || "");

  return (
    <Modal.Root
      opened={modalProps.openModal}
      onClose={() => modalProps.onModalClose(false)}
      centered
      closeOnClickOutside={false}
      classNames={{
        content: "md:min-w-[540px]",
      }}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header className="justify-end pr-4 pt-4">
          <i
            className="icon-cross1 text-2xl/none cursor-pointer text-primary"
            onClick={() => modalProps.onModalClose(false)}
          ></i>
        </Modal.Header>

        <Modal.Body className="px-6 pb-6 pt-2">
          {isQuantityCategory && (
            <>
              <h2 className="text-foreground text-2xl font-poppins font-semibold mb-4 animate-title">Select Quantity</h2>
              <Radio.Group
                value={selectedQty.toString()}
                onChange={(value) => setSelectedQty(Number(value))}
                className="mb-8 mt-6 w-full animate-content"
              >
                <div className="grid md:grid-cols-3 grid-cols-2 gap-5 w-full">
                  {["1", "2", "3"].map((qty) => (
                    <Radio
                      key={qty}
                      value={qty}
                      classNames={getBaseWebRadios(selectedQty.toString(), qty)}
                      label={
                        <div className="text-center relative">
                          <span className="text-foreground">{qty}</span>
                          {selectedQty.toString() === qty && (
                            <span className="absolute top-1/2 right-0 -translate-y-1/2 ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white">
                              <i className="icon-tick text-base/none"></i>
                            </span>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              </Radio.Group>
            </>
          )}

          {modalProps.is_research_only == 1 ? (
            // <div className="bg-warning-bg text-foreground text-sm rounded-xl px-4 py-4 space-y-3 mb-6">
            //   <p className="font-semibold">Warning: Research Use Only</p>
            //   <div className="flex gap-2 items-start">
            //     <i className="icon-check-circle text-lg mt-0.5" />
            //     <span>
            //       <strong>No Medical Claims:</strong> The product has not been evaluated by the FDA and is not intended to diagnose, treat, cure, or prevent any disease.
            //     </span>
            //   </div>

            //   <div className="flex gap-2 items-start">
            //     <i className="icon-check-circle text-lg mt-0.5" />
            //     <span>
            //       <strong>Doctor Consultation:</strong> A consultation with one of our licensed physicians is required before shipment.
            //     </span>
            //   </div>

            //   <div className="flex gap-2 items-start">
            //     <i className="icon-check-circle text-lg mt-0.5" />
            //     <span>
            //       <strong>Research Use Only:</strong> You agree to use this product solely for research purposes.
            //     </span>
            //   </div>

            //   <p className="pt-1">Please click "I Agree" to continue.</p>
            // </div>
            <div className="my-5 space-y-5 rounded-xl border border-dashed border-[#EF3154] bg-[#FFF0EE] px-5 py-5 text-[#C7002A] sm:px-6">
              <div className="flex items-center gap-2.5">
                <IconInfoCircleFilled
                  size={24}
                  className="shrink-0"
                />
                <h6 className="text-[#C7002A] font-semibold">Final Sale Notice - Please Read Carefully</h6>
              </div>
              <p className="text-sm font-medium leading-relaxed text-[#C7002A] sm:text-base">
                Physician-grade products & supplies are provided as-is and are non-refundable and non-replaceable.
              </p>
              <ul className="space-y-3.5 text-sm leading-relaxed sm:text-base">
                <li className="flex gap-2">
                  <IconCircleCheck
                    size={17}
                    stroke={2.4}
                    className="mt-1 shrink-0"
                  />
                  <span>No refunds</span>
                </li>
                <li className="flex gap-2">
                  <IconCircleCheck
                    size={17}
                    stroke={2.4}
                    className="mt-1 shrink-0"
                  />
                  <span>No replacements</span>
                </li>
                <li className="flex gap-2">
                  <IconCircleCheck
                    size={17}
                    stroke={2.4}
                    className="mt-1 shrink-0"
                  />
                  <span>No guarantees</span>
                </li>
                <li className="flex gap-2">
                  <IconCircleCheck
                    size={17}
                    stroke={2.4}
                    className="mt-1 shrink-0"
                  />
                  <span>No additional supplies or instructions</span>
                </li>
                <li className="flex gap-2">
                  <IconCircleCheck
                    size={17}
                    stroke={2.4}
                    className="mt-1 shrink-0"
                  />
                  <span>Reconstitution instructions will not be provided.</span>
                </li>
              </ul>
              <p className="text-sm font-medium leading-relaxed text-[#C7002A] sm:text-base">By proceeding, you acknowledge and accept these terms.</p>
            </div>
          ) : (
            ""
          )}

          {modalProps.showShippingType ? (
            <>
              <h2 className="text-foreground text-2xl font-poppins font-semibold mb-4 animate-title">Shipping Type</h2>
              <Radio.Group
                value={shippingType}
                onChange={(value) => setShippingType(value)}
                className="mb-8 mt-6 w-full animate-content"
              >
                <div className="grid md:grid-cols-2 gap-5 w-full">
                  {["Regular", "Overnight"].map((type) => (
                    <Radio
                      key={type}
                      value={type}
                      classNames={getBaseWebRadios(shippingType, type)}
                      label={
                        <div className="text-center relative">
                          <span className="text-foreground">{type === "Overnight" ? `Overnight (+ $${modalProps.overNightShippingFee || "0"})` : "Regular"}</span>
                          {shippingType === type && (
                            <span className="absolute top-1/2 -right-4 -translate-y-1/2 ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white">
                              <i className="icon-tick text-base/none"></i>
                            </span>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              </Radio.Group>
            </>
          ) : (
            ""
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              className="w-full"
              variant="outline"
              color="primary"
              size="sm-2"
              onClick={modalProps.onModalPressYes}
              disabled={modalProps.okBtnLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              size="sm-2"
              onClick={() => modalProps.onModalPressNo(selectedQty, shippingType)}
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

export default ConfirmProductOrderModal;
