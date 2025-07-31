import { capitalizeAfterSpace } from "@/utils/helper.utils";
import { Button, FocusTrap, Modal, Select } from "@mantine/core";
import { useState } from "react";

interface ModalProps {
  openModal: boolean;
  onModalClose: () => void;
  onSend: (pharmacy: string) => void;
  isLoading: boolean;
}

function CreatePrescription({ openModal, onModalClose, onSend, isLoading }: ModalProps) {
  const [isProceedClicked, setIsProceedClicked] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState("");

  const handleProceed = () => {
    if (selectedPharmacy) {
      setIsProceedClicked(true);
    }
  };

  const dismissModal = () => {
    setIsProceedClicked(false);
    setSelectedPharmacy("");
    onModalClose();
  };

  return (
    <Modal.Root
      opened={openModal}
      onClose={dismissModal}
      centered
      size="542px"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header className="!pb-0">
          <Modal.Title>Create Prescription</Modal.Title>
          <div className="flex items-center gap-3">
            <i
              onClick={dismissModal}
              className="icon-cross text-xl leading-6 cursor-pointer"
            ></i>
          </div>
        </Modal.Header>
        <Modal.Body className="!py-6">
          {!isProceedClicked ? (
            <>
              <p className="text-foreground !font-medium text-fs-lg text-center">Please choose a pharmacy below to continue.</p>
              <div className="mt-[30px]">
                <FocusTrap.InitialFocus />
                <div className="flex flex-col gap-2 relative">
                  <Select
                    label="Pharmacy List"
                    placeholder="Pick Pharmacy"
                    data={[
                      { value: "alpha_bio_meds", label: "Alpha biomed labs" },
                      { value: "epiq_scripts", label: "Epiq Scripts" },
                    ]}
                    defaultValue={selectedPharmacy}
                    onChange={(value) => setSelectedPharmacy(value || "")}
                    rightSection={<i className="icon-down-arrow"></i>}
                    searchable
                  />
                </div>
              </div>
              <div className="flex justify-center gap-2 pt-8">
                <Button
                  w="256px"
                  onClick={handleProceed}
                  disabled={!selectedPharmacy}
                >
                  Proceed
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-foreground !font-medium text-fs-lg text-center">Are you sure you want to send this prescription to pharmacy below?</p>
              <div className="bg-primary-light text-center py-8 rounded mt-6">
                <h5 className=" text-foreground">{capitalizeAfterSpace(selectedPharmacy)}</h5>
              </div>
              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <Button
                  variant="light"
                  w="240px"
                  onClick={() => setIsProceedClicked(false)}
                >
                  Back
                </Button>
                <Button
                  w="240px"
                  onClick={() => onSend(selectedPharmacy)}
                  loading={isLoading}
                >
                  Send
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default CreatePrescription;
