import { IPartnerMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { Button, Modal, Radio } from "@mantine/core";
import { useState } from "react";

interface IConfirmationModalProps {
  openModal: boolean;
  onModalClose: (closeReason: boolean) => void;
  onModalPressYes: () => void;
  onModalPressNo: (qty: number) => void;
  okBtnLoading: boolean;
  medicationInfo?: IPartnerMedicineListItem[];
}

function ConfirmProductOrderModal(modalProps: IConfirmationModalProps) {
  const [selectedQty, setSelectedQty] = useState<number>(1);

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
          <h2 className="text-foreground text-2xl font-poppins font-semibold mb-4 animate-title">Select Quantity</h2>

          <Radio.Group
            value={selectedQty.toString()}
            onChange={(value) => setSelectedQty(Number(value))}
            className="mb-8 mt-6 w-full animate-content"
          >
            <div className="grid md:grid-cols-2 gap-5 w-full">
              {["1", "2"].map((qty) => (
                <Radio
                  key={qty}
                  value={qty}
                  classNames={getBaseWebRadios(selectedQty.toString(), qty)}
                  label={
                    <div className="text-center relative">
                      <span className="text-foreground">
                        {qty} pc{qty === "2" ? "s" : ""}
                      </span>
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

          <div className="bg-warning-bg text-foreground text-sm rounded-xl px-4 py-4 space-y-3 mb-6">
            <p className="font-semibold">Warning: Research Use Only</p>

            <div className="flex gap-2 items-start">
              <i className="icon-check-circle text-lg mt-0.5" />
              <span>
                <strong>No Medical Claims:</strong> The product has not been evaluated by the FDA and is not intended to diagnose, treat, cure, or prevent any disease.
              </span>
            </div>

            <div className="flex gap-2 items-start">
              <i className="icon-check-circle text-lg mt-0.5" />
              <span>
                <strong>Doctor Consultation:</strong> A consultation with one of our licensed physicians is required before shipment.
              </span>
            </div>

            <div className="flex gap-2 items-start">
              <i className="icon-check-circle text-lg mt-0.5" />
              <span>
                <strong>Research Use Only:</strong> You agree to use this product solely for research purposes.
              </span>
            </div>

            <p className="pt-1">Please click "I Agree" to continue.</p>
          </div>

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
              onClick={() => modalProps.onModalPressNo(selectedQty)}
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
